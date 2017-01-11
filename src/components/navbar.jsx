import React from 'react'
import NewBundleButton from './NewBundleButton.jsx'
import CancelButton from './CancelButton.jsx'
import NewBundleInput from './new-bundle-input.jsx'

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

    const logoInput = isCreating ? <NewBundleInput dispatch={this.props.dispatch}/> : <h2 className='logo'>Bundles</h2>
    const button = isCreating ? <CancelButton onClick={toggleCreating}/> : <NewBundleButton onClick={toggleCreating}/>

    return (
      <div>
        <div className='nav-block small left'></div>
        <div className='nav-block big'>{logoInput}</div>
        <div className='nav-block small right'>{button}</div>
      </div>
    )
  }
}
