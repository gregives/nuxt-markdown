import path from 'path'
import glob from 'glob'
import matter from 'gray-matter'

module.exports = async function NuxtMarkdown(moduleOptions) {
  // TODO: Validate module options
  const options = Object.assign({}, this.options.markdown, moduleOptions)

  const collections = {}
  const routes = []

  // Get current routes from configuration
  // TODO: Would extendRoutes be better for this?
  if (typeof this.options.generate.routes === 'function') {
    routes.push(...await this.options.generate.routes())
  } else if (Array.isArray(this.options.generate.routes)) {
    routes.push(this.options.generate.routes)
  }

  // Allow user to generate own routes
  const generateRoutes = function(...newRoutes) {
    routes.push(...newRoutes)
  }

  // Loop through each collection
  for (const collection of options.collections) {
    collections[collection.name] = []

    // TODO: Use glob.hasMagic to check collection directory
    // TODO: Allow user configuration of glob?
    const pattern = collection.includeSubdirectories ? '{,**/}*.md' : '*.md'
    const files = glob.sync(pattern, { cwd: path.join(options.directory, collection.directory) })

    for (const file of files) {
      // TODO: Allow configuration of gray-matter
      const markdown = matter.read(path.join(options.directory, collection.directory, file))

      // Add slug and route to front matter
      // TODO: Does anything else need to be added to the front matter?
      const { dir, name } = path.parse(file)
      markdown.data.file = path
        .join(collection.directory, dir, name)
        .split(path.sep)
        .join('/')
        .replace(/\.md$/, '')

      // TODO: Test routes for
      // - Platform-specific paths
      // - Trailing slash
      // - Base URL
      markdown.data.path = path
        .join(path.sep, this.options.router.base, collection.routePrefix, dir, name)
        .split(path.sep)
        .join('/')
        .replace(/index$/, '')

      // Add trailing slash
      if (this.options.router.trailingSlash && markdown.data.path.substr(-1) !== '/') {
        markdown.data.path += '/'
      }

      collections[collection.name].push(markdown)
    }

    if (typeof collection.transformCollection === 'function') {
      collections[collection.name] = await collection.transformCollection(
        collections[collection.name], {
          // TODO: Does the user need access to any other methods?
          generateRoutes
        }
      )
    }

    // Add new routes to generate
    routes.push(...collections[collection.name].map(({ data }) => data.path))

    // Only add the front matter to state
    collections[collection.name] = collections[collection.name].map(({ data }) => data)
  }

  this.options.generate.routes = routes

  // Add frontmatter-markdown-loader in Vue component mode
  this.extendBuild(function (config) {
    config.module.rules.unshift({
      test: /\.md$/,
      loader: 'frontmatter-markdown-loader',
      options: {
        mode: ['vue-component'],
        // TODO: Allow custom markdown-it configuration
        vue: {
          // TODO: Allow option to change root class name
          root: 'markdown'
        }
      }
    })
  })

  this.addPlugin({
    src: path.resolve(__dirname, 'module.plugin.js'),
    options: {
      collections: JSON.stringify(collections),
      directory: options.directory
    }
  })
}

module.exports.meta = require('../package.json')