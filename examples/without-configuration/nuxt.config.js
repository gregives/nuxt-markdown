const { resolve } = require('path')

module.exports = {
  rootDir: resolve(__dirname, '../..'),
  buildDir: resolve(__dirname, '.nuxt'),
  srcDir: __dirname,
  modules: [
    { handler: require('../../lib/module') }
  ],
  // Test router trailing slash
  router: {
    trailingSlash: true
  }
}
