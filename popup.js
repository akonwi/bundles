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

var BundleList = View.prototype.extend('ul', {
  bundles: [],
  parent: '.content',
  init: function() {
    var v = this
    ChromeStorage.all(function(error, data) {
      if (error)
        console.error(error)
      else {
        v.bundles = Object.keys(data)
        v.render()
      }
    })
    Core.on('add-bundle', this.addBundle, this)
  },
  addBundle: function(name) {
    var v = this
    ChromeStorage.set(name, [], function(error) {
      if (error)
        console.error(error)
      else
        this.all(function(error, data) {
          if (error)
            console.error(error)
          else {
            v.bundles = Object.keys(data)
            v.render()
          }
        })
    })
  },
  content: function() {
    var bundleItems = this.bundles.map(function(name) {
      var li = document.createElement('li')
      li.innerHTML = name
      return li.outerHTML
    })
    return bundleItems.join('')
  }
})

var NewInput = View.prototype.extend('input', {
  parent: '.logo',
  focus: function() { this.element.focus() },
  onKeypress: function(e) {
    if (e.keyIdentifier === 'Enter') {
      var name = e.target.value
      if (name.trim().length > 0) {
        Core.trigger('add-bundle', name)
        Core.trigger('replace-new-bundle-input')
        e.target.remove()
      }
    }
  }
})

var AddButton = View.prototype.extend('a', {
  parent: '.new-button',
  onClick: function(e) {
    e.preventDefault()
    var input = new NewInput({
      class: 'new-bundle-input',
      type: 'text',
      placeholder: 'Bundle name...'
    })
    input.render()
    input.focus()
  },
  content: function() {
    return 'New'
  }
})

var addBtn = new AddButton({ class: 'add', href: '#' })
addBtn.render()
var list = new BundleList({ class: 'bundles' })
list.render()
