import React from 'react'
import {addBundle} from '../actions'
import * as BundleStore from '../bundle-store'

const style = {
  display: 'block',
  width: '90%',
  margin: '0 auto',
  background: 'transparent',
  outline: 'transparent',
  'border-top': 'none',
  'border-right': 'none',
  'border-left': 'none',
  'border-bottom': '.1rem solid white',
  'font-size': 'larger'
}

// // taken from: https://gist.github.com/jed/982883
const idGenerator = (a) => a?(a^Math.random()*16>>a/4).toString(16):([1e7]+-1e3+-4e3+-8e3+-1e11).replace(/[018]/g,idGenerator)

export default ({dispatch, onComplete}) => {
  const onKeyUp = ({keyCode, target}) => {
    if (keyCode === 13) {
      const name = target.value.trim()
      if (name.length > 0) {
        const newBundle = {name, links: [], id: idGenerator()}
        BundleStore.add(newBundle)
        .then(() => dispatch(addBundle(newBundle)))
        onComplete()
      }
    }
  }

  return <input style={style} className='new-bundle-input' autoFocus onKeyUp={onKeyUp} type='text' placeholder='Bundle name...' />
}
