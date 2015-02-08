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

Core.on('replace-new-bundle-input', function() {
  document.querySelector('.logo').textContent = 'Bundles'
})
Core.on('show-new-bundle-input', function() {
  React.render(React.createElement(NewInput, null), document.querySelector('.logo'))
})

var Navbar = React.createClass({displayName: "Navbar",
  render: function() {
    return (
      React.createElement("div", null, 
        React.createElement("h2", {className: "logo"}, "Bundles"), 
        React.createElement(AddBtn, null)
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
    return React.createElement("a", {id: "add-btn", href: "#", onClick: this.onClick}, "New")
  }
})

var NewInput = React.createClass({displayName: "NewInput",
  onkeypress: function(e) {
    if (e.keyIdentifier === 'Enter') {
      console.log(e)
      var name = e.target.value
      if (name.trim().length > 0) {
        Core.trigger('add-bundle', name)
        Core.trigger('replace-new-bundle-input')
        e.target.remove()
      }
    }
  },
  componentDidMount: function() {
    this.getDOMNode().onkeypress = this.onkeypress
    this.getDOMNode().focus()
  },
  render: function() {
    return React.createElement("input", {id: "new-bundle-input", type: "text", placeholder: "Bundle name..."})
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
  },
  render: function() {
    var bundles = this.state.bundles
    return (
      React.createElement("ul", {id: "bundles", className: "accordion"}, 
        
          Object.keys(bundles).map(function(name) {
            var b = { name: name, links: bundles[name] }
            return React.createElement(BundleItem, {bundle: b})
          })
        
      )
    )
  }
})

var BundleItem = React.createClass({displayName: "BundleItem",
  onClick: function(e) {
    e.preventDefault()
    this.refs.links.getDOMNode().classList.toggle('open')
  },
  render: function() {
    return (
      React.createElement("li", {className: "bundle", onClick: this.onClick}, 
        React.createElement("h4", {onClick: this.onClick},  this.props.bundle.name), 
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
