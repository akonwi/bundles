import React from 'react'
import NewBundleInput from './NewBundleInput.jsx'

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

  render() {
    const isCreating = this.state.isCreating
    const toggleCreating = this.toggleCreating.bind(this)

    const logoInput = isCreating ? <NewBundleInput dispatch={this.props.dispatch} onComplete={toggleCreating}/> : <h2 className='logo'>Bundles</h2>
    const button = <a className='nav-btn' href='#' onClick={toggleCreating}>{isCreating ? 'Cancel' : 'New'}</a>

    return (
      <div className="navbar">
        <div className='nav-block small left'></div>
        <div className='nav-block big'>{logoInput}</div>
        <div className='nav-block small right'>{button}</div>
      </div>
    )
  }
}
