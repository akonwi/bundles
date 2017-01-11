import React from 'react'
import Navbar from './Navbar.jsx'
import BundleList from './BundleList.jsx'
import * as BundleStore from '../bundle-store'

class App extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      bundles: props.bundles
    }
  }

  componentDidMount() {
    BundleStore.onChange(bundles => this.setState({bundles}))
  }

  render() {
    return (
      <div>
        <Navbar dispatch={this.props.dispatch}/>
        <BundleList dispatch={this.props.dispatch} bundles={this.state.bundles}/>
      </div>
    )
  }
}

export default App
