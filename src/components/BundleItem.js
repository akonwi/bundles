import React from 'react'
import {StyleSheet, css} from 'aphrodite'
import BundleLink from './BundleLink'
import * as BundleStore from '../bundle-store'
import {deleteBundle, addLink, toggleEditing} from '../actions'

const styles = StyleSheet.create({
  bundles: {
    borderBottom: '.1rem solid grey',
    padding: '.4rem'
  },
  anchors: {
    margin: '0 .2rem'
  },
  conrols: {
    float: 'right'
  },
  bundleRow: {
    display: 'flex',
    justifyContent: 'space-between'
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
  title: {
    display: 'flex',
    alignItems: 'center'
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
      if (existing === undefined) {
        BundleStore.addLinkToBundle(this.props.id, {title, url})
        .then(() => this.props.dispatch(addLink(this.props.id, {title, url})))
      }
    })
  },

  deleteBundle(e) {
    BundleStore.remove(this.props.id)
    .then(() => this.props.dispatch(deleteBundle(this.props.id)))
  },

  toggle(e) {
    this.setState({open: !this.state.open})
  },

  toggleEditing() {
    this.props.dispatch(toggleEditing(this.props.id, this.props.name))
  },

  render() {
    const linksClasses = css(
      styles.links,
      this.state.open && styles['links.open']
    )
    const triangleClasses = css(
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
        <div className={css(styles.bundleRow)}>
          <div className={css(styles.title)}>
            <div id='triangle' className={triangleClasses}></div>
            <h4 className={css(styles.h4Style)} onClick={this.toggle}>{ this.props.name }</h4>
          </div>
          <div>
            <div id='controls' className={css(styles.conrols)}>
              <a href='#' className={anchorsStyles} title='Open all'>
                <i className={icons} onClick={this.openLinks}>launch</i>
              </a>
              <a href='#' className={anchorsStyles} title='Add current page'>
                <i className={icons} onClick={this.addLink}>add</i>
              </a>
              <a href='#' className={anchorsStyles} title='Edit'>
                <i className={icons} onClick={this.toggleEditing}>edit</i>
              </a>
              <a href='#' className={anchorsStyles} title='Delete'>
                <i className={icons} onClick={this.deleteBundle}>delete</i>
              </a>
            </div>
          </div>
        </div>
        <ul id='links' className={linksClasses}>
          { bundleLinks }
        </ul>
      </li>
    )
  }
})
