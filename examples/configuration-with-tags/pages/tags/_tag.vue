<template>
  <main>
    <nuxt-link to="/tags">
      Back to tags
    </nuxt-link>
    <h1>Blog posts tagged with {{ tag }}</h1>
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
  asyncData ({ app, params }) {
    const tag = params.tag
    // Filter blog posts which have tag
    const blogPosts = app.$markdown.blog.filter((blogPost) => {
      return blogPost.tags.findIndex(postTag => postTag.name === tag) >= 0
    })

    return {
      tag,
      blogPosts
    }
  }
}
</script>
