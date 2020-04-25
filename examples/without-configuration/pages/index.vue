<template>
  <main>
    <h1>My Blog Built with Nuxt Markdown</h1>
    <component :is="content" />
    <ol>
      <li v-for="blogPost in blogPosts" :key="blogPost.path">
        <nuxt-link :to="blogPost.path">
          {{ blogPost.title }}
        </nuxt-link>
      </li>
    </ol>
  </main>
</template>

<script>
export default {
  asyncData ({ app }) {
    return {
      blogPosts: app.$markdown.content.filter(file => file.path.startsWith('/blog/'))
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
        components: {
          Counter: () => import('~/components/Counter')
        }
      }
    })
  }
}
</script>
