import ChromeStorage from '../lib/chrome-storage'
import * as Bundle from './bundle'
import * as BundleStore from './bundle-store'
import NavbarFactory from './components/navbar.jsx'

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

  let BundleItem = React.createClass({
    getInitialState() {
      return { shouldFlash: false }
    },
    onClick(e) {
      e.preventDefault()
      let bundle = this.props.bundle
      let b = Bundle.create({
        name: bundle.name,
        open: !bundle.open,
        links: bundle.links
      })
      BundleStore.updateBundle(bundle.name, b)
    },
    openLinks(e) {
      this.props.bundle.links.forEach(({url}) => {
        chrome.tabs.create({ url })
      })
    },
    addLink(e) {
      e.preventDefault()
      chrome.tabs.getSelected(null, ({title, url}) => {
        BundleStore.addLinkToBundle(this.props.bundle.name, { title, url })
        this.setState({shouldFlash: true})
      })
    },
    deleteBundle(e) {
      e.preventDefault()
      BundleStore.removeBundle(this.props.bundle.name)
    },
    render() {
      let linksClasses = cx({
        links: true,
        open: this.props.bundle.open
      })
      let triangleClasses = cx({
        triangle: true,
        down: this.props.bundle.open
      })
      let h4classes = this.state.shouldFlash ? 'flash' : ''
      return (
        <li className='bundle'>
          <div className='title-bar'>
            <div className={triangleClasses}></div>
            <h4 className={h4classes} onClick={this.onClick}>{ this.props.bundle.name }</h4>
            <div className='controls'>
              <a href='#' className='btn' title='Open all'>
                <i className='material-icons' onClick={this.openLinks}>launch</i>
              </a>
              <a href='#' className='btn' title='Add current page'>
                <i className='material-icons' onClick={this.addLink}>add</i>
              </a>
              <a href='#' className='btn' title='Delete'>
                <i className='material-icons' onClick={this.deleteBundle}>delete</i>
              </a>
            </div>
          </div>
          <ul className={linksClasses} ref='links'>
            {
              this.props.bundle.links.map((link) => {
                return <BundleLink link={link} />
              })
            }
          </ul>
        </li>
      )
    }
  })

  let BundleLink = React.createClass({
    getInitialProps() {
      return { link: {} }
    },
    openLink(e) {
      e.preventDefault()
      chrome.tabs.create({ url: this.props.link.url })
    },
    render() {
      let link = this.props.link
      return (
        <li title={link.title}>
          <a href='#' onClick={this.openLink}>{ link.title }</a>
        </li>
      )
    }
  })

  ChromeStorage.all().then((data) => {
    let Navbar = NavbarFactory(Core)
    React.render(<BundleList bundles={data}/>, document.querySelector('.content'))
    React.render(<Navbar />, document.querySelector('.navbar'))
  }).catch(error => { console.error("Couldn't start the app due to: " + error) })
})()
