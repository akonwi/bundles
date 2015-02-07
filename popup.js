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
      var name = e.targetNode.value
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
  getInitialProps: function() { return {} },
  render: function() {
    var bundles = this.props.bundles
    return (
      React.createElement("ul", {id: "bundles"}, 
        
          Object.keys(bundles).map(function(name) {
            var b = { name: name, links: bundles[name] }
            return React.createElement(BundleItem, {bundle: b})
          })
        
      )
    )
  }
})

var BundleItem = React.createClass({displayName: "BundleItem",
  render: function() {
    return (
      React.createElement("li", null, 
        React.createElement("h4", null,  this.props.bundle.name), 
          React.createElement("ul", {id: "links"}, 
          
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
