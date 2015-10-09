import ChromeStorage from '../../lib/chrome-storage'
import createBundleBtn from './create-bundle-btn.jsx'
import logoInput from './logo-input.jsx'

export default () => {
  return React.createClass({
    getInitialState() {
      return { creating: false }
    },
    componentDidMount() {
      ChromeStorage.onChange(changes => {
        Object.keys(changes).some(key => {
          if (!!changes[key].newValue) {
            this.setState({ creating: false })
            return true
          }
        })
      })
    },
    toggleCreateBundleBtn(e) {
      e.preventDefault()
      if (!this.state.cancelling)
        this.setState({ creating: true })
      else
        this.setState({ creating: false })
    },
    render() {
      let CreateBundleBtn = createBundleBtn(this.state.creating, this.toggleCreateBundleBtn)
      let LogoInput = logoInput(this.state.creating)
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
