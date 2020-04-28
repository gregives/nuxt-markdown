const { setup, loadConfig, get } = require('@nuxtjs/module-test-utils')
const { JSDOM } = require('jsdom')

describe('Nuxt Markdown with gray-matter excerpts', () => {
  let nuxt

  beforeAll(async () => {
    ({ nuxt } = await setup(loadConfig(__dirname, '../../examples/gray-matter-excerpts')))
  }, 60000)

  afterAll(async () => {
    await nuxt.close()
  })

  it('renders the index page', async () => {
    const { document } = new JSDOM(await get('/')).window
    expect(document.body.innerHTML).toContain('My Blog Built with Nuxt Markdown')
  })

  it('exposes all Markdown files in the blog collection', async () => {
    const { document } = new JSDOM(await get('/')).window
    expect(document.querySelector('ol').children).toHaveLength(5)
    expect(document.querySelector('ol').innerHTML).toContain('Another Blog Post')
    expect(document.querySelector('ol').innerHTML).toContain('My First Blog Post')
    expect(document.querySelector('ol').innerHTML).toContain('Another Post About Nuxt')
    expect(document.querySelector('ol').innerHTML).toContain('How to Build a Blog with Nuxt')
  })

  it('loads excerpts into the front matter of the blog collection', async () => {
    const { document } = new JSDOM(await get('/')).window
    expect(document.querySelector('ol').innerHTML).toContain('Semper quis lectus nulla at')
    expect(document.querySelector('ol').innerHTML).toContain('Praesent elementum facilisis leo vel fringilla est ullamcorper eget')
    expect(document.querySelector('ol').innerHTML).toContain('Curabitur vitae nunc sed velit dignissim sodales ut eu sem')
    expect(document.querySelector('ol').innerHTML).toContain('Quam elementum pulvinar etiam non quam lacus suspendisse')
  })
})
