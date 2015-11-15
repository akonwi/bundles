import ChromeStorage from '../../lib/chrome-storage'
import bundleItem from './bundle-item.jsx'

export default (bundles) => {
  return () => {
    return {
      render() {
        return (
          <ul className='bundles'>
            {
              Object.keys(bundles).map(name => {
                let BundleItem = bundleItem(bundles[name])
                return <BundleItem/>
              })
            }
          </ul>
        )
      }
    }
  }
}
