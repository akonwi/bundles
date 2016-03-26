import ChromeStorage from '../../lib/chrome-storage'
import CreateBundleBtn from './create-bundle-btn.jsx'
import LogoInput from './logo-input.jsx'

export default ({isCreating, toggleCreating}) => {
  return (
    <div>
      <div className='nav-block small left'></div>
      <div className='nav-block big'>
        <LogoInput isCreating={isCreating}/>
      </div>
      <div className='nav-block small right'><CreateBundleBtn isCreating={isCreating} onClick={toggleCreating}/></div>
    </div>
  )
}
