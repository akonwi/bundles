import React from 'react'

export default function({url, title}) {
  const openLink = (e) => {
    chrome.tabs.create({url})
  }

  return (
    <li>
      <a href='#' onClick={openLink}>{ title }</a>
    </li>
  )
}
