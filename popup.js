var BundleList = View.prototype.extend('ul', {
  bundles: [],
  addBundle: function(name) {
    this.bundles.push(name)
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

var AddButton = View.prototype.extend('a', {
  onClick: function(e) {
    e.preventDefault()
    // TODO: Trigger showing input
  },
  content: function() {
    return 'New'
  }
})

var addBtn = new AddButton({ class: 'add', href: '#' })
addBtn.render('.new-button')
var list = new BundleList({ class: 'bundles' })
list.render('.content')
