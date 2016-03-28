import NewBundleInput from './new-bundle-input.jsx'

export default ({flow, isCreating}) => {
  if (isCreating) {
    return <NewBundleInput flow={flow}/>
  }
  else
    return <h2 className='logo'>Bundles</h2>
}
