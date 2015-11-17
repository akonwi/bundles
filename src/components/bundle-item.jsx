import bundleLink from './bundle-link.jsx'
import * as Bundle from '../bundle'
import * as BundleStore from '../bundle-store'

export default ({name, open, links}) => {
  let toggle = (e) => {
    e.preventDefault()
    let bundle = Bundle.create({name, links, open: !open})
    BundleStore.updateBundle(name, bundle)
  }

  let openLinks = (e) => {
    links.forEach(({url}) => { chrome.tabs.create({url}) })
  }

  let addLink = (e) => {
    e.preventDefault()
    chrome.tabs.getSelected(null, ({title, url}) => {
      BundleStore.addLinkToBundle(name, {title, url})
    })
  }

  let deleteBundle = (e) => {
    e.preventDefault()
    BundleStore.removeBundle(name)
  }

  return () => {
    return {
      render() {
        let linksClasses = classNames({
          links: true,
          open
        })
        let triangleClasses = classNames({
          triangle: true,
          down: open
        })
        return (
          <li className='bundle'>
            <div className='title-bar'>
              <div className={triangleClasses}></div>
              <h4 onClick={toggle}>{ name }</h4>
              <div className='controls'>
                <a href='#' className='btn' title='Open all'>
                  <i className='material-icons' onClick={openLinks}>launch</i>
                </a>
                <a href='#' className='btn' title='Add current page'>
                  <i className='material-icons' onClick={addLink}>add</i>
                </a>
                <a href='#' className='btn' title='Delete'>
                  <i className='material-icons' onClick={deleteBundle}>delete</i>
                </a>
              </div>
            </div>
            <ul className={linksClasses} ref='links'>
              {
                links.map(link => {
                  let BundleLink = bundleLink(link)
                  return <BundleLink/>
                })
              }
            </ul>
          </li>
        )
      }
    }
  }
}
