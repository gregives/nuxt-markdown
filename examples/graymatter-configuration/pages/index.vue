<template>
  <main>
    <h1>My Blog Built with Nuxt Markdown</h1>
    <component :is="content" />
    <ol reversed>
      <li v-for="blogPost in blogPosts" :key="blogPost.path">
        <nuxt-link :to="blogPost.path">
          {{ blogPost.title }}
        </nuxt-link>
        <p>{{ blogPost.excerpt }}</p>
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
