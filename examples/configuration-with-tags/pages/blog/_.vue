<template>
  <main>
    <nuxt-link to="/">
      Back home
    </nuxt-link>
    <h1>{{ blogPost.title }}</h1>
    <time>{{ blogPost.date.toLocaleDateString() }}</time>
    <ul>
      <li v-for="tag in blogPost.tags" :key="tag.name">
        <nuxt-link :to="tag.path">
          #{{ tag.name }}
        </nuxt-link>
      </li>
    </ul>
    <component :is="content" />
  </main>
</template>

<script>
export default {
  asyncData ({ app }) {
    return {
      blogPost: app.$markdown.loadData()
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
