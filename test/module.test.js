const { setup, loadConfig, get } = require('@nuxtjs/module-test-utils')
const { JSDOM } = require('jsdom')

describe('Nuxt Markdown with no configuration', () => {
  let nuxt

  beforeAll(async () => {
    ({ nuxt } = await setup(loadConfig(__dirname, '../../examples/without-configuration')))
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

  it('exposes all Markdown files in the default content collection', async () => {
    const { document } = new JSDOM(await get('/')).window
    expect(document.querySelector('ol').children).toHaveLength(5)
    expect(document.querySelector('ol').innerHTML).toContain('Another Blog Post')
    expect(document.querySelector('ol').innerHTML).toContain('My First Blog Post')
    expect(document.querySelector('ol').innerHTML).toContain('Another Post About Nuxt')
    expect(document.querySelector('ol').innerHTML).toContain('How to Build a Blog with Nuxt')
  })

  it('loads the correct Markdown front matter and content in a nested route', async () => {
    const { document } = new JSDOM(await get('/blog/nuxt/how-to-build-a-blog-with-nuxt/')).window
    expect(document.body.innerHTML).toContain('How to Build a Blog with Nuxt')
    expect(document.body.innerHTML).toContain('Quam elementum pulvinar etiam non quam lacus suspendisse')
    expect(document.querySelector('ul').children).toHaveLength(3)
  })
})
