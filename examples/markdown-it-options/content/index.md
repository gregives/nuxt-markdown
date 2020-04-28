---
title: Index page
---

Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Eu feugiat pretium nibh ipsum consequat nisl. Vulputate dignissim suspendisse in est ante. Aliquam nulla facilisi cras fermentum odio eu feugiat pretium nibh.

<Counter :initial="3" />

```js
const markdownIt = require('markdown-it')({
  html: true,
  xhtmlOut: true,
  typographer: true,
  highlight(str, lang) {
    if (lang && hljs.getLanguage(lang)) {
      try {
        return hljs.highlight(lang, str).value
      } finally {
        // Failed to highlight
      }
    }

    return ''
  }
})
```

Lobortis feugiat vivamus at augue eget arcu dictum varius duis. Cras fermentum odio eu feugiat pretium nibh ipsum consequat nisl. Nibh cras pulvinar mattis nunc sed blandit. Curabitur vitae nunc sed velit dignissim sodales. Blandit turpis cursus in hac habitasse. Mattis ullamcorper velit sed ullamcorper morbi tincidunt ornare. Mollis aliquam ut porttitor leo a diam. Quisque non tellus orci ac auctor augue mauris augue neque. Eget aliquet nibh praesent tristique magna sit amet purus.
