import newBundleInput from './new-bundle-input.jsx'

export default (isCreating) => {
  return () => {
    return {
      render() {
        let NewBundleInput = newBundleInput()
        if (isCreating)
          return <NewBundleInput/>
        else
          return <h2 className='logo'>Bundles</h2>
      }
    }
  }
}
