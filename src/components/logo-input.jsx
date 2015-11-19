import newBundleInput from './new-bundle-input.jsx'

export default (isCreating) => {
  let child
  if (isCreating) {
    let NewBundleInput = newBundleInput()
    child = <NewBundleInput/>
  }
  else
    child = <h2 className='logo'>Bundles</h2>

  const view = {
    render() { return child }
  }

  return () => { return view }
}
