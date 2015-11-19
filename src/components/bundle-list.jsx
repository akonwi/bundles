import ChromeStorage from '../../lib/chrome-storage'
import bundleItem from './bundle-item.jsx'

export default (bundles) => {

  const bundleItems = Object.keys(bundles).map(name => {
    let BundleItem = bundleItem(bundles[name])
    return <BundleItem/>
  })

  const view = {
    render() {
      return (
        <ul className='bundles'>
          { bundleItems }
        </ul>
      )
    }
  }
  
  return () => { return view }
}
