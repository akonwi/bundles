import ChromeStorage from '../lib/chrome-storage'
import navbar from './components/navbar.jsx'
import BundleList from './components/bundle-list.jsx'

(() => {
  let Navbar = navbar()
  React.render(<Navbar/>, document.querySelector('.navbar'))

  ChromeStorage.all().then((data) => {
    React.render(<BundleList bundles={data}/>, document.querySelector('.content'))
  }).catch(error => { console.error("Couldn't start the app due to: " + error) })
})()
