import ChromeStorage from '../lib/chrome-storage'
import * as Bundle from './bundle'
import * as BundleStore from './bundle-store'
import navbar from './components/navbar.jsx'
import BundleItem from './components/bundle-item.jsx'

(() => {
  const cx = React.addons.classSet

  let Core = {
    actions: {},
    on(event, fn, ctx=this) {
      let todos = this.actions[event]
      let todo = {fn, ctx}
      if (!!todos)
        todos.push(todo)
      else
        this.actions[event] = [todo]
    },
    trigger(event, data) {
      var todos = this.actions[event]
      if (!!todos)
        todos.forEach(({fn, ctx}) => {
          fn.call(ctx, data)
        })
    }
  }

  let BundleList = React.createClass({
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
              return <BundleItem bundle={bundles[name]} />
            })
          }
        </ul>
      )
    }
  })

  ChromeStorage.all().then((data) => {
    let Navbar = navbar(Core)
    React.render(<BundleList bundles={data}/>, document.querySelector('.content'))
    React.render(<Navbar/>, document.querySelector('.navbar'))
  }).catch(error => { console.error("Couldn't start the app due to: " + error) })
})()
