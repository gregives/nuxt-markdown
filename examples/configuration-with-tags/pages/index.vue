<template>
  <main>
    <h1>My Blog Built with Nuxt Markdown</h1>
    <component :is="content" />
    <nuxt-link to="/tags">
      See all tags
    </nuxt-link>
    <h2>Blog Posts</h2>
    <ol reversed>
      <li v-for="blogPost in blogPosts" :key="blogPost.path">
        <nuxt-link :to="blogPost.path">
          <h3>{{ blogPost.title }}</h3>
        </nuxt-link>
        <time :datetime="blogPost.date">{{ blogPost.date.toLocaleDateString() }}</time>
        <ul>
          <li v-for="tag in blogPost.tags" :key="tag.name">
            <nuxt-link :to="tag.path">
              #{{ tag.name }}
            </nuxt-link>
          </li>
        </ul>
      </li>
    </ol>
  </main>
</template>

<script>
export default {
  asyncData ({ app }) {
    return {
      blogPosts: app.$markdown.blog
    }
  },
  data () {
    return {
      content: null
    }
  },
  created () {
    this.content = () => this.$markdown.loadContent().then((component) => {
      return {
        ...component,
        // Add async Counter component in Markdown content
        components: {
          Counter: () => import('~/components/Counter')
        }
      }
    })
  }
}
</script>
