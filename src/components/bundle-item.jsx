import bundleLink from './bundle-link.jsx'
import * as Bundle from '../bundle'
import * as BundleStore from '../bundle-store'

export default ({name, open, links}) => {
  const toggle = (e) => {
    let bundle = Bundle.create({name, links, open: !open})
    BundleStore.updateBundle(name, bundle)
  }

  const openLinks = (e) => {
    links.forEach(({url}) => { chrome.tabs.create({url}) })
  }

  const addLink = (e) => {
    chrome.tabs.getSelected(null, ({title, url}) => {
      BundleStore.addLinkToBundle(name, {title, url})
    })
  }

  const deleteBundle = (e) => {
    BundleStore.removeBundle(name)
  }

  const linksClasses = classNames({
    links: true,
    open
  })

  const triangleClasses = classNames({
    triangle: true,
    down: open
  })

  const bundleLinks = links.map(link => {
    let BundleLink = bundleLink(link)
    return <BundleLink/>
  })

  const view = {
    render() {
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
            { bundleLinks }
          </ul>
        </li>
      )
    }
  }

  return () => { return view }
}
