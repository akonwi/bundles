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
          BundleStore.subscribers.forEach(({setState}) => {
            setState({ bundles: data })
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
              <NewInput hidden='true' />
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

  let NewInput = React.createClass({
    getInitialState: function() {
      return { hidden: this.props.hidden }
    },
    onkeypress: function(e) {
      if (e.keyIdentifier === 'Enter') {
        var name = e.target.value
        if (name.trim().length > 0) {
          Core.trigger('add-bundle', name)
          Core.trigger('hide-new-bundle-input')
          e.target.remove()
        }
      }
    },
    componentDidMount: function() {
      this.getDOMNode().onkeypress = this.onkeypress
      var component = this
      Core.on('show-new-bundle-input', function() {
        document.querySelector('.logo').classList.add('hidden')
        component.setState({ hidden: false })
      })
      Core.on('hide-new-bundle-input', function() {
        document.querySelector('.logo').classList.remove('hidden')
        component.setState({ hidden: true })
      })
    },
    componentDidUpdate: function() {
      if (!this.state.hidden)
      this.getDOMNode().focus()
    },
    render: function() {
      var classes = cx({
        'new-bundle-input': true,
        hidden: this.state.hidden
      })
      return <input className={classes} type='text' placeholder='Bundle name...' />
    }
  })

  var BundleList = React.createClass({
    getInitialState: function() {
      return { bundles: this.props.bundles }
    },
    componentDidMount: function() {
      BundleStore.addSubscriber(this)
      Core.on('add-bundle', function(name) {
        BundleStore.addBundle(name)
      })
    },
    render: function() {
      var bundles = this.state.bundles
      return (
        <ul className='bundles'>
          {
            Object.keys(bundles).map(function(name) {
              var b = { name: name, links: bundles[name] }
              return <BundleItem bundle={b} />
            })
          }
        </ul>
      )
    }
  })

  var BundleItem = React.createClass({
    getInitialState: function () {
      return { links: this.props.bundle.links }
    },
    componentWillReceiveProps: function(nextProps) {
      this.setState({ links: nextProps.bundle.links })
    },
    onClick: function(e) {
      e.preventDefault()
      this.setState({ open: !this.state.open })
    },
    addLink: function(e) {
      e.preventDefault()
      var name = this.props.bundle.name
      chrome.tabs.getSelected(null, function(tab) {
        BundleStore.addLinkToBundle(name, { title: tab.title, url: tab.url })
      })
    },
    deleteBundle: function (e) {
      e.preventDefault()
      BundleStore.removeBundle(this.props.bundle.name)
    },
    render: function() {
      var linksClasses = cx({
        links: true,
        open: this.state.open
      })
      var triangleClasses = cx({
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
              this.state.links.map(function(link) {
                return <BundleLink link={link} />
              })
            }
          </ul>
        </li>
      )
    }
  })

  var BundleLink = React.createClass({
    getInitialProps: function() {
      return { link: {} }
    },
    openLink: function(e) {
      e.preventDefault()
      chrome.tabs.create({ url: this.props.link.url })
    },
    render: function() {
      var link = this.props.link
      return (
        <li title={link.title}>
          <a href='#' onClick={this.openLink}>{ link.title }</a>
        </li>
      )
    }
  })

  ChromeStorage.all().then(function(data) {
    BundleStore.init()
    React.render(<BundleList bundles={data} />, document.querySelector('.content'))
    React.render(<Navbar />, document.querySelector('.navbar'))
  }).catch(function(error) { console.error(error) })
})()
