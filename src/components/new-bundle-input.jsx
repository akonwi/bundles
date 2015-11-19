import * as BundleStore from '../bundle-store'

export default () => {
  const onKeyUp = ({keyCode, target}) => {
    if (keyCode === 13) {
      const name = target.value.trim()
      if (name.length > 0)
        BundleStore.addBundle(name)
    }
  }

  const view = {
    render() {
      return <input className='new-bundle-input' autoFocus onKeyUp={onKeyUp} type='text' placeholder='Bundle name...' />
    }
  }

  return () => { return view }
}
