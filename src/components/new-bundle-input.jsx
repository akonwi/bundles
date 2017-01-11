import React from 'react'
import {CreateBundle} from '../commands'

export default ({dispatch, onComplete}) => {
  const onKeyUp = ({keyCode, target}) => {
    if (keyCode === 13) {
      const name = target.value.trim()
      if (name.length > 0) {
        dispatch(CreateBundle({name}))
        onComplete()
      }
    }
  }

  return <input className='new-bundle-input' autoFocus onKeyUp={onKeyUp} type='text' placeholder='Bundle name...' />
}
