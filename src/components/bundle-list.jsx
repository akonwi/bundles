import BundleItem from './BundleItem.jsx'

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
