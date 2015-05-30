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

  var BundleStore = {
    subscribers: [],
    data: null,
    init() {
      ChromeStorage.all().then((data) => { BundleStore.data = data })
      ChromeStorage.onChange((changes) => {
        ChromeStorage.all().then((data) => {
          BundleStore.data = data
          BundleStore.subscribers.forEach(s => {
            s.setState({ bundles: data })
          })
        })
      })
    },
    addSubscriber(subscriber) {
      this.subscribers.push(subscriber)
    },
    addBundle(name) {
      ChromeStorage.set(name, [])
      .catch((err) => { console.error(err) })
    },
    addLinkToBundle(name, link) {
      ChromeStorage.get(name)
      .then((links) => {
        links.push(link)
        return ChromeStorage.set(name, links)
      })
      .catch((err) => { console.error(err) })
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
              <HiddenInput />
              <h2 className='logo'>Bundles</h2>
            </div>
            <div className='nav-block small right'><AddBtn /></div>
          </div>
        )
      }
    }
  }

  let AddBtn = function() {
    let onClick = (e) => {
      e.preventDefault()
      Core.trigger('show-new-bundle-input')
    }
    return {
      render() {
        return <a className='nav-btn' href='#' onClick={onClick}>New</a>
      }
    }
  }

  let HiddenInput = React.createClass({
    getInitialState() {
      return { hidden: true }
    },
    onKeyUp(e) {
      if (e.keyCode === 13) {
        let name = e.target.value
        if (name.trim().length > 0) {
          Core.trigger('add-bundle', name)
          Core.trigger('hide-new-bundle-input')
          e.target.remove()
        }
      }
    },
    componentDidMount() {
      Core.on('show-new-bundle-input', () => {
        document.querySelector('.logo').classList.add('hidden')
        this.setState({ hidden: false })
      })
      Core.on('hide-new-bundle-input', () => {
        document.querySelector('.logo').classList.remove('hidden')
        this.setState({ hidden: true })
      })
    },
    componentDidUpdate() {
      if (!this.state.hidden)
      this.getDOMNode().focus()
    },
    render() {
      let classes = cx({
        'new-bundle-input': true,
        'hidden': this.state.hidden
      })
      return <input className={classes} onKeyUp={this.onKeyUp} type='text' placeholder='Bundle name...' />
    }
  })

  let BundleList = React.createClass({
    getInitialState() {
      return { bundles: this.props.bundles }
    },
    componentDidMount() {
      BundleStore.addSubscriber(this)
      Core.on('add-bundle', (name) => {
        BundleStore.addBundle(name)
      })
    },
    render() {
      let bundles = this.state.bundles
      return (
        <ul className='bundles'>
          {
            Object.keys(bundles).map((name) => {
              let b = { name, links: bundles[name] }
              return <BundleItem bundle={b} />
            })
          }
        </ul>
      )
    }
  })

  let BundleItem = React.createClass({
    getInitialState() {
      return { links: this.props.bundle.links }
    },
    componentWillReceiveProps(nextProps) {
      this.setState({ links: nextProps.bundle.links })
    },
    onClick(e) {
      e.preventDefault()
      this.setState({ open: !this.state.open })
    },
    addLink(e) {
      e.preventDefault()
      let name = this.props.bundle.name
      chrome.tabs.getSelected(null, ({title, url}) => {
        BundleStore.addLinkToBundle(name, { title, url })
      })
    },
    deleteBundle(e) {
      e.preventDefault()
      BundleStore.removeBundle(this.props.bundle.name)
    },
    render() {
      let linksClasses = cx({
        links: true,
        open: this.state.open
      })
      let triangleClasses = cx({
        triangle: true,
        down: this.state.open
      })
      return (
        <li className='bundle'>
          <div className='title-bar'>
            <div className={triangleClasses}></div>
            <h4 onClick={this.onClick}>{ this.props.bundle.name }</h4>
            <img className='icon' onClick={this.addLink} src="/assets/plus.svg"></img>
            <img className='icon' onClick={this.deleteBundle} src="/assets/cross.svg"></img>
          </div>
          <ul className={linksClasses} ref='links'>
            {
              this.state.links.map((link) => {
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
    BundleStore.init()
    React.render(<BundleList bundles={data} />, document.querySelector('.content'))
    React.render(<Navbar />, document.querySelector('.navbar'))
  }).catch(error => { console.error(error) })
})()
