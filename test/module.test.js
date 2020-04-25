const { setup, loadConfig, get } = require('@nuxtjs/module-test-utils')

describe('Nuxt Markdown with no configuration', () => {
  let nuxt

  beforeAll(async () => {
    ({ nuxt } = await setup(loadConfig(__dirname, '../../examples/without-configuration')))
  }, 60000)

  afterAll(async () => {
    await nuxt.close()
  })

  it('renders the index page', async () => {
    const html = await get('/')
    expect(html).toContain('My Blog Built with Nuxt Markdown')
  })
})
