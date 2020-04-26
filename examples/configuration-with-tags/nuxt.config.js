const { resolve } = require('path')

module.exports = {
  rootDir: resolve(__dirname, '../..'),
  buildDir: resolve(__dirname, '.nuxt'),
  srcDir: __dirname,
  modules: [
    { handler: require('../../lib/module') }
  ],
  markdown: {
    collections: [
      {
        name: 'blog',
        directory: 'content/blog',
        includeSubdirectories: true,
        routePrefix: '/blog/',
        serverTransform (collection, { generateRoutes }) {
          collection.forEach(({ content, data }) => {
            // Calculate reading time
            data.mins = Math.round(content.split(' ').length / 250) || 1
            // Add path to taxonomy page
            data.tags = data.tags.map((tag) => {
              return {
                name: tag,
                path: `/tags/${tag}`
              }
            })

            // Generate route for taxonomy page
            generateRoutes(...data.tags.map(tag => tag.path))
          })

          // Sort collection by date descending
          return collection.sort((a, b) => b.data.date - a.data.date)
        },
        clientTransform () {
          return function (collection) {
            // Convert date into Date object
            collection.forEach((data) => {
              data.date = new Date(data.date)
            })

            return collection
          }
        }
      },
      {
        name: 'root',
        directory: 'content',
        includeSubdirectories: false,
        routePrefix: '/'
      }
    ]
  },
  generate: {
    routes () {
      // Mock promise returning routes
      return new Promise((resolve) => {
        setTimeout(() => resolve([]), 100)
      })
    }
  }
}
