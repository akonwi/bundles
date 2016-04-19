import BundleItem from './bundle-item.jsx'

export default ({bundles, dispatch}) => {

  const bundleItems = Object.keys(bundles).map(id => {
    let item = bundles[id]
    return <BundleItem dispatch={dispatch} id={id} name={item.name} open={item.open} links={item.links}/>
  })

  return (
    <ul className='bundles'>
      { bundleItems }
    </ul>
  )
}
