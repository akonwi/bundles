import React from 'react'
import BundleItem from './BundleItem'

export default ({bundles, dispatch}) => {
  const bundleItems = Object.keys(bundles).map(id => {
    let item = bundles[id]
    return <BundleItem dispatch={dispatch} id={id} name={item.name} links={item.links}/>
  })

  return (
    <ul className='bundles'>
      { bundleItems }
    </ul>
  )
}