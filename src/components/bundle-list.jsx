import ChromeStorage from '../../lib/chrome-storage'
import BundleItem from './bundle-item.jsx'

export default ({bundles}) => {

  const bundleItems = Object.keys(bundles).map(name => {
    let item = bundles[name]
    return <BundleItem name={item.name} open={item.open} links={item.links}/>
  })

  return (
    <ul className='bundles'>
      { bundleItems }
    </ul>
  )
}
