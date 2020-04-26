<template>
  <main>
    <nuxt-link to="/">
      Back
    </nuxt-link>
    <h1>{{ blogPost.title }}</h1>
    <time :datetime="blogPost.date">{{ blogPost.date.toLocaleDateString() }}</time>
    <ul>
      <li v-for="tag in blogPost.tags" :key="tag">
        #{{ tag }}
      </li>
    </ul>
    <component :is="content" />
  </main>
</template>

<script>
export default {
  asyncData ({ app }) {
    const blogPost = app.$markdown.loadData()
    // Convert date into Date object, this can be done with `clientTransform` instead
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
