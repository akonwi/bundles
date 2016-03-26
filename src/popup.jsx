import ChromeStorage from '../lib/chrome-storage'
import Navbar from './components/navbar.jsx'
import BundleList from './components/bundle-list.jsx'

(() => {
  let isCreating = false

  const renderNavbar = () => {
    ReactDOM.render(<Navbar isCreating={isCreating} toggleCreating={toggleCreating}/>, document.querySelector('.navbar'))
  }

  const renderBundlelist = () => {
    return ChromeStorage.all().then(bundles => {
      ReactDOM.render(<BundleList bundles={bundles}/>, document.querySelector('.content'))
    })
  }

  const toggleCreating = () => {
    isCreating = !isCreating
    renderNavbar()
  }

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

  renderNavbar()
  renderBundlelist().catch(error => { console.error("Couldn't render BundleList: " + error) })
})()
