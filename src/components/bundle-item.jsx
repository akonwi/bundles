import BundleLink from './bundle-link.jsx'
import * as BundleStore from '../bundle-store'
import {DeleteBundle, AddLink} from '../commands'

export default React.createClass({
  getInitialState() {
    return { open: false }
  },

  openLinks(e) {
    this.props.links.forEach(({url}) => { chrome.tabs.create({url}) })
  },

  addLink(e) {
    chrome.tabs.getSelected(null, ({url, title}) => {
      let existing = this.props.links.find(link => url === link.url && title === link.title)
      if (existing === undefined)
        this.props.dispatch(AddLink({id: this.props.id, title, url}))
    })
  },

  deleteBundle(e) { this.props.dispatch(DeleteBundle({id: this.props.id})) },

  toggle(e) {
    this.setState({open: !this.state.open})
  },

  render() {
    const linksClasses = classNames({
      links: true,
      open: this.state.open
    })

    const triangleClasses = classNames({
      triangle: true,
      down: this.state.open
    })

    const bundleLinks = this.props.links.map(({url, title}) => {
      return <BundleLink url={url} title={title}/>
    })

    return (
      <li className='bundle'>
        <div className='title-bar'>
          <div className={triangleClasses}></div>
          <h4 onClick={this.toggle}>{ this.props.name }</h4>
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
        <ul className={linksClasses}>
          { bundleLinks }
        </ul>
      </li>
    )
  }
})
