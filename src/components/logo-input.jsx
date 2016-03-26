import NewBundleInput from './new-bundle-input.jsx'

export default ({isCreating}) => {
  if (isCreating) {
    return <NewBundleInput/>
  }
  else
    return <h2 className='logo'>Bundles</h2>
}
