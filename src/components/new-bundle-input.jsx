import {CreateBundle} from '../commands'

export default ({flow}) => {
  const onKeyUp = ({keyCode, target}) => {
    if (keyCode === 13) {
      const name = target.value.trim()
      if (name.length > 0) flow.dispatch(CreateBundle({name}))
    }
  }

  return <input className='new-bundle-input' autoFocus onKeyUp={onKeyUp} type='text' placeholder='Bundle name...' />
}
