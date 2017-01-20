import React from 'react'
import {StyleSheet, css} from 'aphrodite'
import BundleLink from './BundleLink'
import * as BundleStore from '../bundle-store'
import {DeleteBundle, AddLink} from '../commands'

const styles = StyleSheet.create({
  bundles: {
    borderBottom: '.1rem solid grey',
    padding: '.4rem'
  },
  bundleRowChildren: {
    verticalAlign: 'middle',
    display: 'inline-block'
  },
  anchors: {
    margin: '0 .2rem'
  },
  conrols: {
    float: 'right'
  },
  icons: {
    fontFamily: 'Material Icons',
    fontWeight: 'normal',
    fontStyle: 'normal',
    fontSize: '1rem',
    display: 'inline-block',
    width: '1em',
    height: '1em',
    lineHeight: 1,
    textTransform: 'none',
    letterSpacing: 'normal',
    wordWrap: 'normal',
    WebkitFontSmoothing: 'antialiased',/* Support for all WebKit browsers. */
    textRendering: 'optimizeLegibility'/* Support for Safari and Chrome. */
  },
  h4Style: {
    margin: '0 .2rem',
    ':hover': {
      cursor: 'pointer'
    }
  },
  triangle: {
    content: "",
    borderColor: 'transparent #111',
    borderStyle: 'solid',
    borderWidth: '0.35em 0 0.35em 0.45em',
    height: 0,
    width: 0
  },
  down: {
    transform: 'rotate(90deg)'
  },
  links: {
    paddingLeft: '1.5rem',
    transition: 'all .2s ease-in-out',
    maxHeight: 0,
    width: '100%',
    overflowX: 'hidden',
  },
  'links.open': {
    maxHeight: '100%',
    overflowY: 'scroll'
  }
})

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
    const linksClasses = css(
      styles.links,
      this.state.open && styles['links.open']
    )
    const triangleClasses = css(
      styles.bundleRowChildren,
      styles.triangle,
      this.state.open && styles.down
    )
    const anchorsStyles = css(styles.anchors)
    const icons = css(styles.icons)

    const bundleLinks = this.props.links.map(({url, title}) => {
      return <BundleLink url={url} title={title}/>
    })

    return (
      <li className={css(styles.bundles)}>
        <div>
          <div id='triangle' className={triangleClasses}></div>
          <h4 className={css(styles.h4Style, styles.bundleRowChildren)} onClick={this.toggle}>{ this.props.name }</h4>
          <div id='controls' className={css(styles.conrols, styles.bundleRowChildren)}>
            <a href='#' className={anchorsStyles} title='Open all'>
              <i className={icons} onClick={this.openLinks}>launch</i>
            </a>
            <a href='#' className={anchorsStyles} title='Add current page'>
              <i className={icons} onClick={this.addLink}>add</i>
            </a>
            <a href='#' className={anchorsStyles} title='Delete'>
              <i className={icons} onClick={this.deleteBundle}>delete</i>
            </a>
          </div>
        </div>
        <ul id='links' className={linksClasses}>
          { bundleLinks }
        </ul>
      </li>
    )
  }
})
