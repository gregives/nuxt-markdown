export default function NuxtMarkdown (moduleOptions) {
  const options = Object.assign({}, this.options.markdown, moduleOptions)
  console.log(options)
}