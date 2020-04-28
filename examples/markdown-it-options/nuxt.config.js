const { resolve } = require('path')
const hljs = require('highlight.js')

const markdownIt = require('markdown-it')({
  html: true,
  xhtmlOut: true,
  typographer: true,
  highlight (str, lang) {
    if (lang && hljs.getLanguage(lang)) {
      try {
        return `<pre class="hljs"><code>${hljs.highlight(lang, str, true).value}</code></pre>`
      } catch {
        // Syntax highlighting failed
      }
    }

    return `<pre class="hljs"><code>${markdownIt.utils.escapeHtml(str)}</code></pre>`
  }
})

module.exports = {
  rootDir: resolve(__dirname, '../..'),
  buildDir: resolve(__dirname, '.nuxt'),
  srcDir: __dirname,
  modules: [
    { handler: require('../../lib/module') }
  ],
  css: [
    'highlight.js/styles/shades-of-purple.css'
  ],
  markdown: {
    markdownIt
  }
}
