import ChromeStorage from '../lib/chrome-storage'
import navbar from './components/navbar.jsx'
import bundleList from './components/bundle-list.jsx'

(() => {
  let isCreating = false

  const renderNavbar = () => {
    const Navbar = navbar(isCreating, toggleCreating)
    ReactDOM.render(<Navbar/>, document.querySelector('.navbar'))
  }

  const renderBundlelist = () => {
    return ChromeStorage.all().then(bundles => {
      const BundleList = bundleList(bundles)
      ReactDOM.render(<BundleList/>, document.querySelector('.content'))
    })
  }

  const toggleCreating = () => {
    isCreating = !isCreating
    renderNavbar()
  }

  renderNavbar()

  ChromeStorage.onChange(changes => {
    renderBundlelist()
    Object.keys(changes).some(key => {
      let {newValue, oldValue} =  changes[key]
      if (!oldValue) {
        toggleCreating()
        renderNavbar()
        return true
      }
    })
  })

  renderBundlelist().catch(error => { console.error("Couldn't render BundleList: " + error) })
})()
