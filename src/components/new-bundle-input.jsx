import BundleStore from '../bundle-store'

export default function(Core) {
  return React.createClass({
    onKeyUp(e) {
      if (e.keyCode === 13) {
        let name = e.target.value
        if (name.trim().length > 0) {
          BundleStore.addBundle(name)
          Core.trigger('hide-new-bundle-input')
        }
      }
    },
    componentDidMount() {
      this.getDOMNode().focus()
    },
    render() {
      return <input className='new-bundle-input' onKeyUp={this.onKeyUp} type='text' placeholder='Bundle name...' />
    }
  })
}
