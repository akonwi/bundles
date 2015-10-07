import bundleLink from './bundle-link.jsx'
import * as Bundle from '../bundle'
import * as BundleStore from '../bundle-store'

const cx = React.addons.classSet

export default React.createClass({
  onClick(e) {
    e.preventDefault()
    let bundle = this.props.bundle
    let b = Bundle.create({
      name: bundle.name,
      open: !bundle.open,
      links: bundle.links
    })
    BundleStore.updateBundle(bundle.name, b)
  },
  openLinks(e) {
    this.props.bundle.links.forEach(({url}) => {
      chrome.tabs.create({ url })
    })
  },
  addLink(e) {
    e.preventDefault()
    chrome.tabs.getSelected(null, ({title, url}) => {
      BundleStore.addLinkToBundle(this.props.bundle.name, { title, url })
    })
  },
  deleteBundle(e) {
    e.preventDefault()
    BundleStore.removeBundle(this.props.bundle.name)
  },
  render() {
    let linksClasses = cx({
      links: true,
      open: this.props.bundle.open
    })
    let triangleClasses = cx({
      triangle: true,
      down: this.props.bundle.open
    })
    return (
      <li className='bundle'>
        <div className='title-bar'>
          <div className={triangleClasses}></div>
          <h4 onClick={this.onClick}>{ this.props.bundle.name }</h4>
          <div className='controls'>
            <a href='#' className='btn' title='Open all'>
              <i className='material-icons' onClick={this.openLinks}>launch</i>
            </a>
            <a href='#' className='btn' title='Add current page'>
              <i className='material-icons' onClick={this.addLink}>add</i>
            </a>
            <a href='#' className='btn' title='Delete'>
              <i className='material-icons' onClick={this.deleteBundle}>delete</i>
            </a>
          </div>
        </div>
        <ul className={linksClasses} ref='links'>
          {
            this.props.bundle.links.map((link) => {
              let BundleLink = bundleLink(link)
              return <BundleLink/>
            })
          }
        </ul>
      </li>
    )
  }
})
