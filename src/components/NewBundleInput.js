import React from 'react'
import {CreateBundle} from '../commands'

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

  return <input style={style} className='new-bundle-input' autoFocus onKeyUp={onKeyUp} type='text' placeholder='Bundle name...' />
}
