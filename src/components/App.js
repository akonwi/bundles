import React from 'react'
import Navbar from './Navbar'
import BundleList from './BundleList'
import * as BundleStore from '../bundle-store'

const loadingStyle = {
  textAlign: 'center',
  margin: '.5rem'
}

class App extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      bundles: null
    }
  }

  componentDidMount() {
    const setState = bundles => this.setState({bundles})
    BundleStore.get().then(setState)
    BundleStore.onChange(setState)
  }

  render() {
    const list = this.state.bundles ?
      <BundleList dispatch={this.props.dispatch} bundles={this.state.bundles}/>
      :
      <div style={loadingStyle}>Loading...</div>

    return (
      <div>
        <Navbar dispatch={this.props.dispatch}/>
        { list }
      </div>
    )
  }
}

export default App
