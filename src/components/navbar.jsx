import createBundleBtn from './create-bundle-btn.jsx'
import logoInput from './logo-input.jsx'

export default function(Core) {
  return React.createClass({
    getInitialState() {
      return { cancelling: false }
    },
    toggleCreateBundleBtn(e) {
      e.preventDefault()
      if (!this.state.cancelling)
        this.setState({ cancelling: true })
      else
        this.setState({ cancelling: false })
    },
    render() {
      let CreateBundleBtn = createBundleBtn(this.state.cancelling, this.toggleCreateBundleBtn)
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
  })
}
