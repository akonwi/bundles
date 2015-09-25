export default function({url, title}) {
  let openLink = (e) => {
    e.preventDefault()
    chrome.tabs.create({url})
  }

  return React.createElement(function() {
    return {
      render() {
        return (
          <li title={title}>
            <a href='#' onClick={openLink}>{ title }</a>
          </li>
        )
      }
    }
  })
}
