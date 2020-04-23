const imports = <%= options.imports %>

function loadContent() {
  const data = this.loadData()

  return imports[data.collection](data.file).then((markdown) => {
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
    ...<%= options.collections %>,
    loadContent,
    loadData: loadData.bind(app)
  })
}
