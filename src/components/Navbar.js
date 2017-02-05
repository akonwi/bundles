import React from 'react'
import {StyleSheet, css} from 'aphrodite'
import NewBundleInput from './NewBundleInput'
import EditBundleInput from './EditBundleInput'
import {toggleEditing} from '../actions'

const navBlockStyles = StyleSheet.create({
  base: {
    display: 'inline-block',
    width: '33.33%',
    height: '100%'
  },
  big: {
    width: '60%'
  },
  small: {
    width: '20%'
  },
  right: {
    textAlign: 'right'
  },
  left: {
    textAlign: 'left'
  }
})

const styles = {
  logo: {
    textAlign: 'center'
  },
  navbar: {
    width: '100%',
    height: '10%',
    backgroundColor: '#8CD19D',
    padding: '.5rem'
  },
  navBtn: {
    textDecoration: 'none',
    color: 'white',
    fontWeight: 'bold',
    fontSize: '.8rem',
  }
}

export default class Navbar extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      isCreating: false
    }
  }

  toggleCreating() {
    this.setState({isCreating: !this.state.isCreating})
  }

  toggleEditing() {
    this.props.dispatch(toggleEditing())
  }

  render() {
    const isCreating = this.state.isCreating
    const toggleCreating = this.toggleCreating.bind(this)
    const toggleEditing = this.toggleEditing.bind(this)

    let logoInput;
    let button;
    if (isCreating) {
      logoInput = <NewBundleInput dispatch={this.props.dispatch} onComplete={toggleCreating}/>
      button = <a id='nav-btn' style={styles.navBtn} href='#' onClick={toggleCreating}>Cancel</a>
    }
    else if (this.props.isEditing) {
      logoInput = <EditBundleInput dispatch={this.props.dispatch} onComplete={toggleEditing} editProps={this.props.editProps}/>
      button = <a id='nav-btn' style={styles.navBtn} href='#' onClick={toggleEditing}>Cancel</a>
    }
    else {
      logoInput = <h2 style={styles.logo}>Bundles</h2>
      button = <a id='nav-btn' style={styles.navBtn} href='#' onClick={toggleCreating}>New</a>
    }

    return (
      <div style={styles.navbar}>
        <div className={css(navBlockStyles.base, navBlockStyles.small, navBlockStyles.left)}></div>
        <div className={css(navBlockStyles.base, navBlockStyles.big)}>{logoInput}</div>
        <div className={css(navBlockStyles.base, navBlockStyles.small, navBlockStyles.right)}>{button}</div>
      </div>
    )
  }
}
