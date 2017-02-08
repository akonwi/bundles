import React from 'react'
import BundleItem from './BundleItem'

const bundlesStyle = {
  listStyleType: 'none',
  padding: '0 .5rem 0 .5rem'
}

export default ({bundles, dispatch, toggleEditing}) => {
  const bundleItems = bundles.map(({id, name, links}) => (
    <BundleItem dispatch={dispatch} toggleEditing={toggleEditing} id={id} name={name} links={links}/>
  ))

  return (
    <ul style={bundlesStyle}>
      { bundleItems }
    </ul>
  )
}
