import React from 'react'
import ReactDOM from 'react-dom'
import {createStore} from 'redux'
import App from './components/App'

(() => {
  const app = (state, action) => {
    if (state === undefined) {
      state = {
        bundles: undefined,
        isEditing: false
      }
    }

    if (action.type === 'INITIALIZE') {
      return Object.assign({}, state, {bundles: action.bundles})
    }
    if (action.type === 'ADD_BUNDLE') {
      const newState = {
        bundles: Object.assign({}, state.bundles, {[action.bundle.id]: action.bundle})
      }
      return Object.assign({}, state, newState)
    }
    if (action.type === 'DELETE_BUNDLE') {
      const newState = Object.assign({}, state)
      delete newState.bundles[action.id]
      return newState
    }
    if (action.type === 'ADD_LINK_TO_BUNDLE') {
      const bundle = state.bundles[action.id]
      const newBundle = Object.assign({}, bundle, {links: bundle.links.concat(action.link)})
      const newBundles = Object.assign({}, state.bundles, {[action.id]: newBundle})
      return Object.assign({}, state, {bundles: newBundles})
    }
    if (action.type === 'TOGGLE_EDITING') {
      const newState = {
        isEditing: !state.isEditing,
        bundleToEdit: !state.isEditing ? action.bundle : undefined
      }
      return Object.assign({}, state, newState)
    }
    if (action.type === 'RENAME_BUNDLE') {
      const bundle = state.bundles[action.id]
      const newBundle = Object.assign({}, bundle, {name: action.name})
      const newBundles = Object.assign({}, state.bundles, {[action.id]: newBundle})
      return Object.assign({}, state, {bundles: newBundles})
    }
    return state
  }

  const store = createStore(app)

  const render = () => ReactDOM.render(<App store={store}/>, document.querySelector('.main'))

  store.subscribe(render)
  render()
})()
