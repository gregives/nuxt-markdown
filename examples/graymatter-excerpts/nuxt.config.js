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
        serverTransform (collection) {
          collection.forEach(({ data, excerpt }) => {
            // Nuxt Markdown only retains the data from each collection
            data.excerpt = excerpt
          })
          return collection
        }
      }
    ],
    grayMatter: {
      excerpt: true
    }
  }
}
