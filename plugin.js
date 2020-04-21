export default ({ app }) => {
  app.markdown = JSON.parse('<%= options.state %>')
}