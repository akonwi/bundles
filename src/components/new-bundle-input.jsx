import * as BundleStore from '../bundle-store'

export default function(Core) {
  let onKeyUp = (e) => {
    if (e.keyCode === 13) {
      let name = e.target.value
      if (name.trim().length > 0) {
        BundleStore.addBundle(name)
        Core.trigger('hide-new-bundle-input')
      }
    }
  }

  return React.createElement(() => {
    return {
      render() {
        return <input className='new-bundle-input' autoFocus onKeyUp={onKeyUp} type='text' placeholder='Bundle name...' />
      }
    }
  })
}
