<template>
  <main>
    <nuxt-link to="/">
      Back home
    </nuxt-link>
    <h1>Blog Post Tags</h1>
    <ol>
      <li v-for="tag in tags" :key="tag.name">
        <nuxt-link :to="tag.path">
          #{{ tag.name }}
        </nuxt-link>
        {{ tag.count }}
      </li>
    </ol>
  </main>
</template>

<script>
export default {
  asyncData ({ app }) {
    const blogPosts = app.$markdown.blog

    // Count the occurrences of tag in blog posts
    const tags = blogPosts.reduce((tags, blogPost) => {
      blogPost.tags.forEach((tag) => {
        if (tag.name in tags) {
          tags[tag.name].count++
        } else {
          tags[tag.name] = {
            ...tag,
            count: 1
          }
        }
      })
      return tags
    }, {})

    return {
      // Sort tags by count descending
      tags: Object.keys(tags).map(tag => tags[tag]).sort((a, b) => b.count - a.count)
    }
  }
}
</script>
