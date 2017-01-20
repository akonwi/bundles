import React from 'react'

const style = {
  lineHeight: 1.5,
  whiteSpace: 'nowrap'
}

export default function({url, title}) {
  const openLink = (e) => {
    chrome.tabs.create({url})
  }

  return (
    <li style={style}>
      <a href='#' onClick={openLink}>{ title }</a>
    </li>
  )
}
