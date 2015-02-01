var Core = {
  actions: {},
  on: function(event, fn) {
    var todos = this.actions[event]
    if (!!todos)
      todos.push(fn)
    else
      this.actions[event] = [fn]
  },
  trigger: function(event, data) {
    var todos = this.actions[event]
    if (!!todos)
      todos.forEach(function(todo) {
        todo(data)
      })
  }
}

Core.on('replace-new-bundle-input', function() {
  document.querySelector('.logo').textContent = 'Bundles'
})

var BundleList = View.prototype.extend('ul', {
  bundles: [],
  init: function() {
    Core.on('add-bundle', this.addBundle)
  },
  addBundle: function(name) {
    // TODO: save in chrome.storage
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
  onClick: function(e) {
    e.preventDefault()
    var input = new NewInput({
      class: 'new-bundle-input',
      type: 'text',
      placeholder: 'Bundle name...'
    })
    input.render('.logo')
    input.focus()
  },
  content: function() {
    return 'New'
  }
})

var addBtn = new AddButton({ class: 'add', href: '#' })
addBtn.render('.new-button')
var list = new BundleList({ class: 'bundles' })
list.render('.content')
