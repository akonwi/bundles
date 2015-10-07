import ChromeStorage from '../../lib/chrome-storage'
import bundleItem from './bundle-item.jsx'

export default React.createClass({
  getInitialState() {
    return { bundles: this.props.bundles }
  },
  componentDidMount() {
    ChromeStorage.onChange(changes => {
      ChromeStorage.all().then(bundles => this.setState({ bundles }))
    })
  },
  render() {
    let bundles = this.state.bundles
    return (
      <ul className='bundles'>
        {
          Object.keys(bundles).map((name) => {
            let BundleItem = bundleItem(bundles[name])
            return <BundleItem/>
          })
        }
      </ul>
    )
  }
})
