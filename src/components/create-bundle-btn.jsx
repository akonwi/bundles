export default function(Core) {
  return React.createClass({
    getInitialState() {
      return { showCancel: false }
    },
    componentDidMount: function() {
      Core.on('hide-new-bundle-input', () => this.setState({ showCancel: false }))
    },
    onClick(e) {
      e.preventDefault()
      if (!this.state.showCancel) {
        Core.trigger('show-new-bundle-input')
        this.setState({ showCancel: true })
      }
      else {
        Core.trigger('hide-new-bundle-input')
        this.setState({ showCancel: false })
      }
    },
    render() {
      let text = this.state.showCancel ? 'Cancel' : 'New'
      return <a className='nav-btn' href='#' onClick={this.onClick}>{text}</a>
    }
  })
}
