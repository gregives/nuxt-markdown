// eslint-disable-next-line
const collections = <%= options.collections %>

for (const collection in collections) {
  if (collections[collection].transform) {
    const transform = new Function(`return ${collections[collection].transform}`)()
    collections[collection].files = transform(collections[collection].files)
  }
}

function loadContent() {
  const data = this.loadData()

  return collections[data.collection].import(data.file).then((markdown) => {
    return {
      extends: markdown.vue.component
    }
  })
}

function loadData() {
  const { app, error, route } = this.context
  
  for (const collection in app.$markdown) {
    if (typeof app.$markdown[collection] === 'function') {
      continue
    }

    for (const data of app.$markdown[collection]) {
      if (data.path === route.path) {
        return {
          ...data, collection
        }
      }
    }
  }

  error({ statusCode: 404, message: 'This page could not be found' })
}

module.exports = function({ app }, inject) {
  inject('markdown', {
    ...Object.keys(collections).reduce((acc, collection) => {
      acc[collection] = collections[collection].files
      return acc
    }, {}),
    loadContent,
    loadData: loadData.bind(app)
  })
}
