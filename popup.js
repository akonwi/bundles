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

var BundleStore = {
  subscribers: [],
  data: null,
  init: function() {
    ChromeStorage.all().then(function(data) { BundleStore.data = data })
    ChromeStorage.onChange(function(changes) {
      ChromeStorage.all().then(function(data) {
        BundleStore.data = data
        BundleStore.subscribers.forEach(function(s) {
          s.setState({ bundles: data })
        })
      })
    })
  },
  addSubscriber: function(subscriber) {
    this.subscribers.push(subscriber)
  },
  addBundle: function(name) {
    ChromeStorage.set(name, [])
    .catch(function(err) { console.error(err) })
  },
  addLinkToBundle: function(name, link) {
    ChromeStorage.get(name)
    .then(function(links) {
      links.push(link)
      return ChromeStorage.set(name, links)
    })
    .catch(function(err) { console.error(err) })
  },
  removeBundle: function(name) {
    ChromeStorage.remove(name)
    .catch(function(err) { console.error(err) })
  }
}

var Navbar = React.createClass({displayName: "Navbar",
  render: function() {
    return (
      React.createElement("div", null, 
        React.createElement("div", {className: "nav-block small left"}), 
        React.createElement("div", {className: "nav-block big"}, 
          React.createElement(NewInput, {hidden: true}), 
          React.createElement("h2", {className: "logo"}, "Bundles")
        ), 
        React.createElement("div", {className: "nav-block small right"}, React.createElement(AddBtn, null))
      )
    )
  }
})

var AddBtn = React.createClass({displayName: "AddBtn",
  onClick: function(e) {
    e.preventDefault()
    Core.trigger('show-new-bundle-input')
  },
  render: function() {
    return React.createElement("a", {className: "nav-btn", href: "#", onClick: this.onClick}, "New")
  }
})

var NewInput = React.createClass({displayName: "NewInput",
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
    return React.createElement("input", {className: classes, type: "text", placeholder: "Bundle name..."})
  }
})

var BundleList = React.createClass({displayName: "BundleList",
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
      React.createElement("ul", {className: "bundles"}, 
        
          Object.keys(bundles).map(function(name) {
            var b = { name: name, links: bundles[name] }
            return React.createElement(BundleItem, {bundle: b})
          })
        
      )
    )
  }
})

var BundleItem = React.createClass({displayName: "BundleItem",
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
      React.createElement("li", {className: "bundle"}, 
        React.createElement("div", {className: "title-bar"}, 
          React.createElement("div", {className: triangleClasses}), 
          React.createElement("h4", {onClick: this.onClick},  this.props.bundle.name), 
          React.createElement("img", {className: "icon", onClick: this.addLink, src: "/assets/plus.svg"}), 
          React.createElement("img", {className: "icon", onClick: this.deleteBundle, src: "/assets/cross.svg"})
        ), 
        React.createElement("ul", {className: linksClasses, ref: "links"}, 
          
            this.state.links.map(function(link) {
              return React.createElement(BundleLink, {link: link})
            })
          
        )
      )
    )
  }
})

var BundleLink = React.createClass({displayName: "BundleLink",
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
      React.createElement("li", {title: link.title}, 
        React.createElement("a", {href: "#", onClick: this.openLink},  link.title)
      )
    )
  }
})

ChromeStorage.all().then(function(data) {
  BundleStore.init()
  React.render(React.createElement(BundleList, {bundles: data}), document.querySelector('.content'))
  React.render(React.createElement(Navbar, null), document.querySelector('.navbar'))
}).catch(function(error) { console.error(error) })
