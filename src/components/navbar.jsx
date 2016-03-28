import CreateBundleBtn from './create-bundle-btn.jsx'
import NewBundleInput from './new-bundle-input.jsx'

export default ({flow, isCreating, toggleCreating}) => {
  const logoInput = isCreating ? <NewBundleInput flow={flow}/> : <h2 className='logo'>Bundles</h2>
  return (
    <div>
      <div className='nav-block small left'></div>
      <div className='nav-block big'>{logoInput}</div>
      <div className='nav-block small right'>
        <CreateBundleBtn isCreating={isCreating} onClick={toggleCreating}/>
      </div>
    </div>
  )
}
