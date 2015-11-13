import ChromeStorage from '../lib/chrome-storage'
import navbar from './components/navbar.jsx'
import BundleList from './components/bundle-list.jsx'

(() => {
  let Navbar = navbar()
  ReactDOM.render(<Navbar/>, document.querySelector('.navbar'))

  ChromeStorage.all().then((data) => {
    ReactDOM.render(<BundleList bundles={data}/>, document.querySelector('.content'))
  }).catch(error => { console.error("Couldn't start the app due to: " + error) })
})()
