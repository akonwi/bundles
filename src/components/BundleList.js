import React from 'react'
import BundleItem from './BundleItem'

const bundlesStyle = {
  listStyleType: 'none',
  padding: '0 .5rem 0 .5rem'
}

export default ({bundles, dispatch}) => {
  const bundleItems = Object.keys(bundles).map(id => {
    let item = bundles[id]
    return <BundleItem dispatch={dispatch} id={id} name={item.name} links={item.links}/>
  })

  return (
    <ul style={bundlesStyle}>
      { bundleItems }
    </ul>
  )
}
