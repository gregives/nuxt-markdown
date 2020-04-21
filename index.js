import path from 'path'
import glob from 'glob'
import matter from 'gray-matter'

export default async function NuxtMarkdown(moduleOptions) {
  // TODO: Validate module options
  const options = Object.assign({}, this.options.markdown, moduleOptions, {
    router: this.options.router
  })

  const state = {}
  const routes = []

  // Get current routes from configuration
  // TODO: Would extendRoutes be better for this?
  if (typeof this.options.generate.routes === 'function') {
    routes.push(...await this.options.generate.routes())
  } else if (Array.isArray(this.options.generate.routes)) {
    routes.push(this.options.generate.routes)
  }

  // Loop through each collection
  for (const collection of options.collections) {
    state[collection.name] = []

    // TODO: Use glob.hasMagic to check collection directory
    const pattern = collection.includeSubdirectories ? '{,**/}*.md' : '*.md'
    const files = glob.sync(pattern, { cwd: collection.directory })

    for (const file of files) {
      // TODO: Allow configuration of gray-matter
      const markdown = matter.read(path.join(collection.directory, file))

      // Add slug and route to front matter
      // TODO: Does anything else need to be added to the front matter?
      const { dir, name } = path.parse(file)
      markdown.data.slug = name

      // TODO: Test routes for
      // - Platform-specific paths
      // - Trailing slash
      // - Base URL
      markdown.data.route = path
        .join(options.router.base, path.sep, collection.routePrefix, dir, name)
        .split(path.sep)
        .join('/')
        .replace(/index$/, '')

      // Add trailing slash
      if (options.router.trailingSlash && markdown.data.route.substr(-1) !== '/') {
        markdown.data.route += '/'
      }

      state[collection.name].push(markdown)
    }

    if (typeof collection.transformCollection === 'function') {
      state[collection.name] = await collection.transformCollection(
        state[collection.name]
      )
    }

    // Add new routes to generate
    routes.push(...state[collection.name].map(({ data }) => data.route))

    // Only add the front matter to state
    state[collection.name] = state[collection.name].map(({ data }) => data)
  }

  this.options.generate.routes = routes

  this.addPlugin({
    src: path.resolve(__dirname, 'plugin.js'),
    options: {
      state: JSON.stringify(state)
    }
  })
}
