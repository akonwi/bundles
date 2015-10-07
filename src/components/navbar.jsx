import createBundleBtn from './create-bundle-btn.jsx'
import logoInput from './logo-input.jsx'

export default function(Core) {
  return function() {
    return {
      render() {
        let CreateBundleBtn = createBundleBtn(Core)
        let LogoInput = logoInput(Core)
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
  }
}
