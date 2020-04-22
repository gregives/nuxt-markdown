function loadContent() {
  const data = loadData.bind(this)()

  return import(`~/<%= options.directory %>/${data.file}.md`).then((markdown) => {
    return {
      extends: markdown.vue.component
    }
  })
}

function loadData() {
  const { app, route } = this.context

  for (const collection in app.$markdown) {
    if (typeof app.$markdown[collection] === 'function') {
      continue
    }

    for (const data of app.$markdown[collection]) {
      if (data.path === route.path) {
        return data
      }
    }
  }
}

export default ({ app }, inject) => {
  inject('markdown', {
    ...JSON.parse('<%= options.collections %>'),
    loadContent: loadContent.bind(app),
    loadData: loadData.bind(app)
  })
}
