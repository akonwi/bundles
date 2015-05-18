var cx = React.addons.classSet

var Core = {
  actions: {},
  on: function(event, fn, ctx) {
    ctx = ctx || this
    var todos = this.actions[event]
    if (!!todos)
      todos.push({ do: fn, ctx: ctx})
    else
      this.actions[event] = [{ do: fn, ctx: ctx}]
  },
  trigger: function(event, data) {
    var todos = this.actions[event]
    if (!!todos)
      todos.forEach(function(todo) {
        todo.do.call(todo.ctx, data)
      })
  }
}

var Navbar = React.createClass({
  render: function() {
    return (
      <div>
        <div className='nav-block small left'></div>
        <div className='nav-block big'>
          <NewInput hidden={true} />
          <h2 className='logo'>Bundles</h2>
        </div>
        <div className='nav-block small right'><AddBtn /></div>
      </div>
    )
  }
})

var AddBtn = React.createClass({
  onClick: function(e) {
    e.preventDefault()
    Core.trigger('show-new-bundle-input')
  },
  render: function() {
    return <a className='nav-btn' href='#' onClick={this.onClick}>New</a>
  }
})

var NewInput = React.createClass({
  getInitialState: function() {
    return { hidden: this.props.hidden }
  },
  componentWillMount: function() {
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
  onkeypress: function(e) {
    if (e.keyIdentifier === 'Enter') {
      console.log(e)
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
  componentWillMount: function() {
    var comp = this
    Core.on('add-bundle', function(name) {
      ChromeStorage.set(name, [])
      .then(function() { return ChromeStorage.all() })
      .then(function(bundles) { comp.setState({ bundles: bundles }) })
      .catch(function(err) { console.error(err) })
    })
    Core.on('delete-bundle', function() {
      ChromeStorage.all()
      .then(function(bundles) { comp.setState({ bundles: bundles }) })
      .catch(function(err) { console.error('Could not retrieve all items', err) })
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
  onClick: function(e) {
    e.preventDefault()
    this.setState({ open: !this.state.open })
  },
  addLink: function(e) {
    e.preventDefault()
    var name = this.props.bundle.name
    var comp = this
    chrome.tabs.getSelected(null, function(tab) {
      ChromeStorage.get(name)
      .then(function(links) {
        links.push({ title: tab.title, url: tab.url })
        return ChromeStorage.set(name, links)
      })
      .then(function(links) {
        comp.setState({ links: links })
      })
      .catch(function(err) {
        console.error("Could not save new bundle", err)
      })
    })
  },
  delete: function (e) {
    e.preventDefault()
    var comp = this
    ChromeStorage.remove(this.props.bundle.name)
    .then(function() {
      Core.trigger('delete-bundle')
    })
    .catch(function(err) {
      console.error(err)
      console.error("Couldn't delete %s from storage", comp.props.bundle.name)
    })
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
          <img className='icon' onClick={this.delete} src="/assets/cross.svg"></img>
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
  React.render(<BundleList bundles={data} />, document.querySelector('.content'))
  React.render(<Navbar />, document.querySelector('.navbar'))
}).catch(function(error) { console.error(error) })
