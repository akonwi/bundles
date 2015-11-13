import ChromeStorage from '../lib/chrome-storage'
import navbar from './components/navbar.jsx'
import BundleList from './components/bundle-list.jsx'

(() => {
  let isCreating = false

  const renderNavbar = () => {
    const Navbar = navbar(isCreating, toggleCreating)
    ReactDOM.render(<Navbar/>, document.querySelector('.navbar'))
  }

  const toggleCreating = () => {
    isCreating = !isCreating
    renderNavbar()
  }

  renderNavbar()

  ChromeStorage.onChange(changes => {
    Object.keys(changes).some(key => {
      if (!!changes[key].newValue) {
        toggleCreating()
        renderNavbar()
        return true
      }
    })
  })

  ChromeStorage.all().then((data) => {
    ReactDOM.render(<BundleList bundles={data}/>, document.querySelector('.content'))
  }).catch(error => { console.error("Couldn't start the app due to: " + error) })
})()
