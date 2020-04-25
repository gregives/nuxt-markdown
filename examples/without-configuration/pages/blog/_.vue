<template>
  <main>
    <nuxt-link to="/">
      Back
    </nuxt-link>
    <h1>{{ blogPost.title }}</h1>
    <p>{{ blogPost.date.toLocaleDateString() }}</p>
    <ul>
      <li v-for="tag in blogPost.tags" :key="tag">
        {{ tag }}
      </li>
    </ul>
    <component :is="content" />
  </main>
</template>

<script>
export default {
  asyncData ({ app }) {
    const blogPost = app.$markdown.loadData()
    blogPost.date = new Date(blogPost.date)

    return {
      blogPost
    }
  },
  data () {
    return {
      content: null
    }
  },
  created () {
    this.content = () => this.$markdown.loadContent()
  }
}
</script>
