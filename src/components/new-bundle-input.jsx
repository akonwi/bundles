import * as BundleStore from '../bundle-store'

export default () => {
  let onKeyUp = ({keyCode, target}) => {
    if (keyCode === 13) {
      let name = target.value.trim()
      if (name.length > 0)
        BundleStore.addBundle(name)
    }
  }

  return () => {
    return {
      render() {
        return <input className='new-bundle-input' autoFocus onKeyUp={onKeyUp} type='text' placeholder='Bundle name...' />
      }
    }
  }
}
