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
  React.render(<NewInput />, document.querySelector('.logo'))
})

var Navbar = React.createClass({
  render: function() {
    return (
      <div>
        <h2 className='logo'>Bundles</h2>
        <AddBtn />
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
    return <a id='add-btn' href='#' onClick={this.onClick}>New</a>
  }
})

var NewInput = React.createClass({
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
    return <input id='new-bundle-input' type='text' placeholder='Bundle name...' />
  }
})

var BundleList = React.createClass({
  getInitialProps: function() { return {} },
  render: function() {
    var bundles = this.props.bundles
    return (
      <ul id='bundles'>
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
  render: function() {
    return (
      <li>
        <h4>{ this.props.bundle.name }</h4>
          <ul id='links'>
          {
            this.props.bundle.links.map(function(link) {
              return <li>{ link }</li>
            })
          }
          </ul>
      </li>
    )
  }
})

ChromeStorage.all(function(error, data) {
  if (error)
    console.error(error)
  else {
    React.render(<BundleList bundles={data} />, document.querySelector('.content'))
    React.render(<Navbar />, document.querySelector('.navbar'))
  }
})
