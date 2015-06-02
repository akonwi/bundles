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

  /**
    * Not a class but factory function to create bundle objects.
    * Bundles consist of 'name', 'open', and 'links' attributes.
    * @param attributes {Object}
    */
  let Bundle = ({name, open=false, links=[]}) => {
    if (name === undefined)
      throw new Error("Cannot create a bundle without a name.")
    return { name, links, open}
  }

  const BundleStore = {
    subscribers: [],
    init(data) {
      this.data = data
      ChromeStorage.onChange((changes) => {
        ChromeStorage.all().then((data) => {
          this.data = data
          this.subscribers.forEach(s => {
            s.setState({ bundles: data })
          })
        })
      })
    },
    // Returns mixin for component use
    Subscriber() {
      let store = this
      return {
        getInitialState() {
          return { bundles: store.data }
        },
        componentDidMount() {
          store.subscribers.push(this)
        }
      }
    },
    addBundle(name) {
      let b = Bundle({name})
      ChromeStorage.set(name, b)
      .catch((err) => { console.error(err) })
    },
    addLinkToBundle(name, link) {
      ChromeStorage.get(name)
      .then(bundle => {
        bundle.links.push(link)
        return ChromeStorage.set(name, bundle)
      })
      .catch((err) => { console.error(err) })
    },
    updateBundle(name, bundle) {
      ChromeStorage.set(name, bundle)
      .catch(err => { console.error(err) })
    },
    removeBundle(name) {
      ChromeStorage.remove(name)
      .catch((err) => { console.error(err) })
    }
  }

  let Navbar = function() {
    return {
      render() {
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

  let CreateBundleBtn = React.createClass({
    getInitialState() {
      return { showCancel: false }
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

  let LogoInput = React.createClass({
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
      if (this.state.showInput)
        return <NewBundleInput />
      else
        return <h2 className='logo'>Bundles</h2>
    }
  })

  let NewBundleInput = React.createClass({
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

  let BundleList = React.createClass({
    mixins: [BundleStore.Subscriber()],
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
      const bundle = this.props.bundle
      const b = Bundle({
        name: bundle.name,
        open: !bundle.open,
        links: bundle.links
      })
      BundleStore.updateBundle(bundle.name, b)
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
            <img className='icon' onClick={this.addLink} src="/assets/plus.svg"></img>
            <img className='icon' onClick={this.deleteBundle} src="/assets/cross.svg"></img>
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
    BundleStore.init(data)
    React.render(<BundleList />, document.querySelector('.content'))
    React.render(<Navbar />, document.querySelector('.navbar'))
  }).catch(error => { console.error("Couldn't start the app due to: " + error) })
})()
