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

var Navbar = React.createClass({displayName: "Navbar",
  render: function() {
    return (
      React.createElement("div", null, 
        React.createElement("div", {className: "nav-block small left"}, React.createElement(AddToBtn, null)), 
        React.createElement("div", {className: "nav-block big"}, 
          React.createElement(NewInput, {hidden: true}), 
          React.createElement("h2", {className: "logo"}, "Bundles")
        ), 
        React.createElement("div", {className: "nav-block small right"}, React.createElement(AddBtn, null))
      )
    )
  }
})

var AddToBtn = React.createClass({displayName: "AddToBtn",
  onClick: function(e) {
    e.preventDefault()
  },
  render: function() {
    return React.createElement("a", {className: "nav-btn", href: "#", onClick: this.onClick}, "Add to")
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
    return React.createElement("input", {className: classes, type: "text", placeholder: "Bundle name..."})
  }
})

var BundleList = React.createClass({displayName: "BundleList",
  getInitialState: function() {
    return { bundles: this.props.bundles }
  },
  componentWillMount: function() {
    var comp = this
    Core.on('add-bundle', function(name) {
      ChromeStorage.set(name, [], function(err) {
        if (err)
          console.error(err)
        else
         ChromeStorage.all(function(err, data) {
           comp.setState({ bundles: data })
         })
      })
    })
    Core.on('delete-bundle', function() {
      ChromeStorage.all(function(err, data) {
        if (err)
          console.error('Could not retrieve all items')
        else
          comp.setState({ bundles: data })
      })
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
  onClick: function(e) {
    e.preventDefault()
    this.refs.links.getDOMNode().classList.toggle('open')
  },
  addLink: function(e) {
    e.preventDefault()
    var name = this.props.bundle.name
    var comp = this
    chrome.tabs.getSelected(null, function(tab) {
      ChromeStorage.get(name, function(err, links) {
        links.push(tab.url)
        this.set(name, links, function(err) {
          if (err)
            console.error("Could not save new bundle")
          else
            comp.setState({ links: links })
        })
      })
    })
  },
  delete: function (e) {
    e.preventDefault()
    var comp = this
    ChromeStorage.remove(this.props.bundle.name, function(err) {
      if (err)
        console.error("Couldn't delete %s from storage", comp.props.bundle.name)
      else
        Core.trigger('delete-bundle')
    })
  },
  render: function() {
    return (
      React.createElement("li", {className: "bundle"}, 
        React.createElement("div", {className: "title-bar"}, 
          React.createElement("h4", {onClick: this.onClick},  this.props.bundle.name), 
          React.createElement("button", {className: "btn", onClick: this.addLink}, "+"), 
          React.createElement("button", {className: "btn", onClick: this.delete}, "x")
        ), 
        React.createElement("ul", {className: "links", ref: "links"}, 
          
            this.props.bundle.links.map(function(link) {
              return React.createElement("li", null, link )
            })
          
        )
      )
    )
  }
})

ChromeStorage.all(function(error, data) {
  if (error)
    console.error(error)
  else {
    React.render(React.createElement(BundleList, {bundles: data}), document.querySelector('.content'))
    React.render(React.createElement(Navbar, null), document.querySelector('.navbar'))
  }
})
