import NewBundleInputFactory from './new-bundle-input.jsx'

export default function(Core) {
  return React.createClass({
    getInitialState() {
      return { showInput: false }
    },
    componentDidMount() {
      Core.on('show-new-bundle-input', () => {
        this.setState({ showInput: true })
      })
      Core.on('hide-new-bundle-input', () => {
        this.setState({ showInput: false })
      })
    },
    render() {
      let NewBundleInput = NewBundleInputFactory(Core)
      if (this.state.showInput)
        return <NewBundleInput />
      else
        return <h2 className='logo'>Bundles</h2>
    }
  })
}
