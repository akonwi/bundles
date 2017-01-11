import React from 'react'
import Navbar from './Navbar.jsx'
import BundleList from './BundleList.jsx'
import * as BundleStore from '../bundle-store'

class App extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      bundles: {}
    }
  }

  componentDidMount() {
    BundleStore.get().then(bundles => this.setState({bundles}))
    BundleStore.onChange(bundles => this.setState({bundles}))
  }

  render() {
    let list
    if (Object.keys(this.state.bundles).length === 0)
      list = <div className='loading'>Loading...</div>
    else
      list = <BundleList dispatch={this.props.dispatch} bundles={this.state.bundles}/>

    return (
      <div>
        <Navbar dispatch={this.props.dispatch}/>
        { list }
      </div>
    )
  }
}

export default App
