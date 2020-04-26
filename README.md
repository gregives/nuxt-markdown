# Nuxt Markdown

[![npm version][npm-version-src]][npm-version-href]
[![npm downloads][npm-downloads-src]][npm-downloads-href]
[![Github Actions CI][github-actions-ci-src]][github-actions-ci-href]
[![Codecov][codecov-src]][codecov-href]
[![License][license-src]][license-href]

> Nuxt Markdown is a simple but highly-configurable Nuxt.js module which allows you to use Markdown files for the content of your website. This makes it the perfect module to port your site over from Jekyll, or another static site generator.

<details>
<summary>Contents</summary>

- [Features](#features)
- [Getting Started](#getting-started)
- [Configuration](#configuration)
    - [Collections](#collections)
        - [`name`](#name)
        - [`directory`](#directory)
        - [`includeSubdirectories`](#includesubdirectories)
        - [`routePrefix`](#routeprefix)
        - [`serverTransform`](#servertransform)
        - [`clientTransform`](#clienttransform)
- [Example](#example)
- [Development](#development)
- [License](#license)

</details>

## Features

- No configuration required
- Highly-configurable when you want it to be
- Supports static site generation
- Nested heirarchy of Markdown content
- **Use Vue components in your Markdown**
- Access and transform the front matter in your Markdown
- Uses [markdown-it](https://github.com/markdown-it/markdown-it) and [gray-matter](https://github.com/jonschlinkert/gray-matter) which you can configure
- Supports excerpts of Markdown files
- Easy to create taxonomy pages

## Getting Started

1. Add `nuxt-markdown` as a `devDependency` to your project

```bash
yarn add nuxt-markdown --dev
# Or
npm install nuxt-markdown --save-dev
```

2. Add `nuxt-markdown` to the `buildModules` section of `nuxt.config.js`

```js
export default {
  buildModules: ['nuxt-markdown']
}
```

3. Make a `content` directory and add some Markdown files to it, feel free to add some nested directories as well. You'll also need to create a corresponding Nuxt.js page in which you can access your Markdown content.

```
├── content
|   ├── blog
|   |   ├── another-blog-post.md
|   |   └── my-first-blog-post.md
|   └── index.md
├── pages
|   ├── blog
|   |   └── _.vue
|   └── index.vue
└── nuxt.config.js
```

4. Nuxt Markdown injects `$markdown` into the context and Vue instances of your app. By default, `$markdown` exposes:

    - `$markdown.content`: an array of the front matter from all of the Markdown files inside your `content` directory.
    - `$markdown.loadContent()`: function to load the content of the Markdown file corresponding to the current route. Returns a Vue component, which can be used as a dynamic `component`.
    - `$markdown.loadData()`: function to load the front matter of the Markdown file corresponding to the current route.

```vue
<template>
  <main>
    <h1>{{ blogPostFrontMatter.title }}</h1>
    <component :is="blogPostContent" />
    <ul>
      <li v-for="blogPost in allBlogPosts" :key="blogPost.path">
        <nuxt-link :to="blogPost.path">
          {{ blogPost.title }}
        </nuxt-link>
      </li>
    </ul>
  </main>
</template>

<script>
export default {
  asyncData({ app }) {
    return {
      allBlogPosts: app.$markdown.content,
      blogPostFrontMatter: app.$markdown.loadData()
    }
  },
  data() {
    return {
      blogPostContent: null
    }
  },
  created() {
    this.blogPostContent = () => this.$markdown.loadContent()
  }
}
</script>
```

## Configuration

You can configure Nuxt Markdown in your `nuxt.config.js` by either passing options directly or using top level options:

```js
export default {
  buildModules: [
    ['nuxt-markdown', {
      collections: [],
      grayMatter: {}
    }]
  ],
  markdown: {
    collections: [],
    grayMatter: {}
  }
}
```

### Collections

Nuxt Markdown allows you to have multiple `collections` of Markdown files. Each collection is described by a configuration object. Here are the configuration options for a collection:

| Name                                              | Description                                         | Type       |
|---------------------------------------------------|-----------------------------------------------------|------------|
| [`name`](#name)                                   | Name of the collection                              | `String`   |
| [`directory`](#directory)                         | Directory of the Markdown files                     | `String`   |
| [`includeSubdirectories`](#includesubdirectories) | If the collection should include nested directories | `Boolean`  |
| [`routePrefix`](#routeprefix)                     | Prefix of the collection routes                     | `String`   |
| [`serverTransform`](#servertransform)             | Function to transform the collection on the server  | `Function` |
| [`clientTransform`](#clienttransform)             | Function to transform the collection on the client  | `Function` |

#### `name`

The name of the collection. You'll use this to refer to the collection in _any_ page of your site. For example, if you named a collection `blog`, you could show a list of blog posts like so:

```vue
<template>
  <ol>
    <li v-for="blogPost in blogPosts" :key="blogPost.title">
      {{ blogPost.title }}
    </li>
  </ol>
</template>

<script>
export default {
  asyncData({ app }) {
    return {
      blogPosts: app.$markdown.blog // This is the important bit!
    }
  }
}
</script>
```

#### `directory`

The directory in which your content lives. In this example, `directory` would be `content/blog`. It's good to be as specific as possible (instead of relying on `includeSubdirectories`), as every Markdown file within `directory` is included into its own client-side bundle.

```
├── content
|   └── blog
|       ├── another-blog-post.md
|       └── my-first-blog-post.md
└── nuxt.config.js
```

#### `includeSubdirectories`

If `includeSubdirectories` is `false`, Nuxt Markdown will only look in `directory` for Markdown files and not inside subdirectories. If `includeSubdirectories` is `true`, Nuxt Markdown will look in subdirectories for Markdown files, and the subdirectory will form part of the route for that Markdown file. Given the following file structure and configuration:

```
├── content
|   └── blog
|       ├── nuxt
|       |   ├── another-post-about-nuxt.md
|       |   └── how-to-build-a-blog-with-nuxt.md
|       ├── another-blog-post.md
|       └── my-first-blog-post.md
└── nuxt.config.js
```

```js
export default {
  markdown: {
    collections: [
      {
        name: 'blog',
        directory: 'content/blog',
        includeSubdirectories: true,
        routePrefix: '/blog/'
      }
    ]
  }
}
```

The following routes will be generated:

```bash
/blog/another-blog-post
/blog/my-first-blog-post
/blog/nuxt/another-post-about-nuxt
/blog/nuxt/how-to-build-a-blog-with-nuxt
```

#### `routePrefix`

The prefix of the route which will be generated for each file in the collection. This doesn't necessarily need to match the `directory` of the collection (but often will). Given the same example above, if the route prefix was changed to `/posts/`

```js
export default {
  markdown: {
    collections: [
      {
        name: 'blog',
        directory: 'content/blog',
        includeSubdirectories: true,
        routePrefix: '/posts/'
      }
    ]
  }
}
```

Then the following routes would be generated:

```bash
/posts/another-blog-post
/posts/my-first-blog-post
/posts/nuxt/another-post-about-nuxt
/posts/nuxt/how-to-build-a-blog-with-nuxt
```

#### `serverTransform`

You may want to add properties to the front matter of your content, or change the order of a collection. `serverTransform` and `clientTransform` can be used to do this, on the server- and client-side respectively.

Nuxt Markdown uses [gray-matter](https://github.com/jonschlinkert/gray-matter) to read the front matter and content of Markdown files on the server-side. `serverTransform` is a function, which takes the following parameters:

- `collection`, an array of `file` objects from gray-matter. For more information about the `file` object, [see the documentation here](https://github.com/jonschlinkert/gray-matter#returned-object).

- `helpers`, an object containing helper functions. Currently, this only includes:

  - `generateRoutes`, a function to generate routes. This can be used in conjunction with [`generate.routes` in your `nuxt.config.js`](https://nuxtjs.org/api/configuration-generate/#routes).

```js
// Generate a single route
generateRoutes('/categories')

// Generate multiple routes
generateRoutes(...['/categories/nuxt', '/categories/markdown'])
```

`serverTransform` should return the collection. [See the example](#example) for a better idea of how you can use `serverTransform`.

#### `clientTransform`

Nuxt Markdown needs to serialize your front matter before injecting it into a Nuxt.js plugin, where it is deserialized; this means that everything is essentially passed through `JSON.parse(JSON.stringify(collection))`. If your front matter contains any types unsupported by JSON, **especially if your front matter contains dates**, then `clientTransform` can be used to reinstate these types. Try to use `serverTransform` instead of `clientTransform` where you can, as any code in `clientTransform` will be included in the client-side bundle.

`clientTransform` takes no arguments. However, it must **return a function** which takes the parameter:

- `collection`, an array of the front matter from your files (the [`data` property from gray-matter](https://github.com/jonschlinkert/gray-matter#returned-object)).

The function **returned** by `clientTransform` should return the collection. Check out [the example](#example) which should make it clear!

### Configuring gray-matter

Nuxt Markdown uses the default configuration of gray-matter. However, you can pass your own configuration to gray-matter, if for example, you want to take an excerpt from your Markdown content. Have a look at the [gray-matter documentation](https://github.com/jonschlinkert/gray-matter#options) for more information.

Note that Nuxt Markdown only retains the `data` property from gray-matter, so you'll need to store the excerpt in data, using `serverTransform`.

```js
export default {
  markdown: {
    collections: [
      {
        name: 'blog',
        includeSubdirectories: true,
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
```

## Example

This is an example configuration of Nuxt Markdown for a portfolio website, with blog posts and projects. First of all, the file structure:

```
├── content
|   ├── posts
|   |   ├── nuxt
|   |   |   ├── another-post-about-nuxt.md
|   |   |   └── how-to-build-a-blog-with-nuxt.md
|   |   ├── another-blog-post.md
|   |   └── my-first-blog-post.md
|   └── projects
|       ├── nuxt-markdown.md
|       └── my-website.md
├── pages
|   ├── blog
|   |   └── _.vue
|   ├── projects
|   |   └── _.vue
|   └── index.vue
└── nuxt.config.js
```

The configuration of Nuxt Markdown in `nuxt.config.js`:

```js
export default {
  buildModules: ['nuxt-markdown'],
  markdown: {
    collections: [
      {
        name: 'blog',
        directory: 'content/posts',
        includeSubdirectories: true,
        routePrefix: '/blog/',
        serverTransform(collection, { generateRoutes }) {
          collection.forEach(({ content, data }) => {
            data.mins = Math.round(content.split(' ').length / 250) || 1
            data.tags = data.tags.map((tag) => {
              return {
                name: tag,
                path: `/tags/${tag}`
              }
            })
            generateRoutes(...data.tags.map((tag) => tag.path))
          })

          return collection.sort((a, b) => b.data.date - a.data.date)
        },
        clientTransform() {
          return function(collection) {
            collection.forEach((data) => {
              data.date = new Date(data.date)
            })

            return collection
          }
        }
      },
      {
        name: 'projects',
        directory: 'content/projects',
        includeSubdirectories: false,
        routePrefix: '/projects/',
        clientTransform() {
          return function(collection) {
            collection.forEach((data) => {
              data.date = new Date(data.date)
            })

            return collection
          }
        }
      }
    ]
  }
}
```

The following routes will be generated:

```bash
/
/blog/another-blog-post
/blog/my-first-blog-post
/blog/nuxt/another-post-about-nuxt
/blog/nuxt/how-to-build-a-blog-with-nuxt
/projects/nuxt-markdown
/projects/my-website

# And routes for any tags in the Markdown front matter
/tags/nuxt
/tags/markdown
```

To show a list of blog posts on the home page (in `index.vue`):

```vue
<template>
  <ol>
    <li v-for="blogPost in blogPosts" :key="blogPost.title">
      <nuxt-link :to="blogPost.path">
        <h1>{{ blogPost.title }}</h1>
      </nuxt-link>
    </li>
  </ol>
</template>

<script>
export default {
  asyncData({ app }) {
    return {
      blogPosts: app.$markdown.blog
    }
  }
}
</script>
```

And to show the content of an individual blog post, in `blog/_.vue`:

```vue
<template>
  <main>
    <h1>{{ blogPost.title }}</h1>
    <component :is="blogPostContent" />
  </main>
</template>

<script>
export default {
  asyncData({ app }) {
    return {
      blogPost: app.$markdown.loadData()
    }
  },
  data() {
    return {
      blogPostContent: null
    }
  },
  created() {
    this.blogPostContent = () => this.$markdown.loadContent()
  }
}
</script>
```

## Development

1. Clone this repository
2. Install dependencies using `yarn install`
3. Start development server using `yarn dev`

## License

[MIT License](./LICENSE)

Copyright &copy; Greg Ives <greg@gregives.co.uk> (https://gregives.co.uk)

<!-- Badges -->
[npm-version-src]: https://img.shields.io/npm/v/nuxt-markdown/latest.svg
[npm-version-href]: https://npmjs.com/package/nuxt-markdown

[npm-downloads-src]: https://img.shields.io/npm/dt/nuxt-markdown.svg
[npm-downloads-href]: https://npmjs.com/package/nuxt-markdown

[github-actions-ci-src]: https://img.shields.io/github/workflow/status/gregives/nuxt-markdown/ci
[github-actions-ci-href]: https://github.com/gregives/nuxt-markdown/actions?query=workflow%3Aci

[codecov-src]: https://img.shields.io/codecov/c/github/gregives/nuxt-markdown.svg
[codecov-href]: https://codecov.io/gh/gregives/nuxt-markdown

[license-src]: https://img.shields.io/npm/l/nuxt-markdown.svg
[license-href]: https://npmjs.com/package/nuxt-markdown
