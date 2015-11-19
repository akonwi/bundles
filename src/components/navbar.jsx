import ChromeStorage from '../../lib/chrome-storage'
import createBundleBtn from './create-bundle-btn.jsx'
import logoInput from './logo-input.jsx'

export default (isCreating, toggle) => {
  const view = {
    render() {
      let CreateBundleBtn = createBundleBtn(isCreating, toggle)
      let LogoInput = logoInput(isCreating)
      return (
        <div>
          <div className='nav-block small left'></div>
          <div className='nav-block big'>
            <LogoInput />
          </div>
          <div className='nav-block small right'><CreateBundleBtn /></div>
        </div>
      )
    }
  }
  return () => { return view }
}
