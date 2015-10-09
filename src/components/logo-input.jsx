import newBundleInput from './new-bundle-input.jsx'

export default (creating) => {
  return () => {
    return {
      render() {
        let NewBundleInput = newBundleInput()
        if (creating)
          return <NewBundleInput/>
        else
          return <h2 className='logo'>Bundles</h2>
      }
    }
  }
}
