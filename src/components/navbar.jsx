import CreateBundleBtnFactory from './create-bundle-btn.jsx'
import LogoInputFactory from './logo-input.jsx'

export default function(Core) {
  return React.createElement(function() {
    return {
      render() {
        let CreateBundleBtn = CreateBundleBtnFactory(Core)
        let LogoInput = LogoInputFactory(Core)
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
  })
}
