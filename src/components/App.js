import React from 'react'
import Navbar from './Navbar'
import BundleList from './BundleList'
import * as BundleStore from '../bundle-store'

const loadingStyle = {
  textAlign: 'center',
  margin: '.5rem'
}

class App extends React.Component {
  componentDidMount() {
    BundleStore.get()
    .then(bundles => this.props.store.dispatch({type: 'INITIALIZE', bundles}))
    .catch(console.err)
  }

  render() {
    const store = this.props.store
    const state = store.getState()
    const bundles = state.bundles

    const list = bundles ?
      <BundleList bundles={bundles} dispatch={store.dispatch}/>
      :
      <div style={loadingStyle}>Loading...</div>

    return (
      <div>
        <Navbar dispatch={store.dispatch} isEditing={state.isEditing} editProps={state.bundleToEdit}/>
        { list }
      </div>
    )
  }
}

export default App
