const { setup, loadConfig, get } = require('@nuxtjs/module-test-utils')
const { JSDOM } = require('jsdom')

describe('Nuxt Markdown with instance of markdown-it', () => {
  let nuxt

  beforeAll(async () => {
    ({ nuxt } = await setup(loadConfig(__dirname, '../../examples/markdown-it-options')))
  }, 60000)

  afterAll(async () => {
    await nuxt.close()
  })

  it('renders the index page', async () => {
    const { document } = new JSDOM(await get('/')).window
    expect(document.body.innerHTML).toContain('My Blog Built with Nuxt Markdown')
  })

  it('loads the Markdown content', async () => {
    const { document } = new JSDOM(await get('/')).window
    expect(document.body.innerHTML).toContain('Lorem ipsum dolor sit amet')
  })

  it('loads Vue components in the Markdown content', async () => {
    const { document } = new JSDOM(await get('/')).window
    expect(document.body.innerHTML).toContain('Current count: 3')
  })

  it('loads Vue components in the Markdown content', async () => {
    const { document } = new JSDOM(await get('/')).window
    expect(document.body.innerHTML).toContain('Current count: 3')
  })

  it('uses the given highlight function to syntax highlight code blocks', async () => {
    const { document } = new JSDOM(await get('/')).window
    expect(document.body.innerHTML).toContain('<pre class="hljs">')
    expect(document.body.innerHTML).toContain('<span class="hljs-keyword">')
    expect(document.body.innerHTML).toContain('<span class="hljs-comment">')
  })
})
