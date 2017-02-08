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
      return Object.assign({}, state, {bundles: state.bundles.concat(action.bundle)})
    }
    if (action.type === 'DELETE_BUNDLE') {
      const newState = {
        bundles: state.bundles.filter(bundle => bundle.id !== action.id)
      }
      return Object.assign({}, state, newState)
    }
    if (action.type === 'ADD_LINK_TO_BUNDLE') {
      const newState = {
        bundles: state.bundles.map(bundle => bundle.id === action.id ? Object.assign({}, bundle, {links: bundle.links.concat(action.link)}): bundle)
      }
      return Object.assign({}, state, newState)
    }
    if (action.type === 'TOGGLE_EDITING') {
      const newState = {
        isEditing: !state.isEditing,
        bundleToEdit: !state.isEditing ? action.bundle : undefined
      }
      return Object.assign({}, state, newState)
    }
    if (action.type === 'RENAME_BUNDLE') {
      const newState = {
        bundles: state.bundles.map(bundle => bundle.id === action.id ? Object.assign({}, bundle, {name: action.name}) : bundle)
      }
      return Object.assign({}, state, newState)
    }
    return state
  }

  const store = createStore(app)

  const render = () => ReactDOM.render(<App store={store}/>, document.querySelector('.main'))

  store.subscribe(render)
  render()
})()
