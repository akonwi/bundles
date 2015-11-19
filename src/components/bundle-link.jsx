export default function({url, title}) {
  const openLink = (e) => {
    chrome.tabs.create({url})
  }

  const view = {
    render() {
      return (
        <li title={title}>
          <a href='#' onClick={openLink}>{ title }</a>
        </li>
      )
    }
  }

  return () => { return view }
}
