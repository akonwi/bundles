/**
 * View object
 *
 * @param tag Name of HTML tag
 * @param [{attrs}] HTML attributes in an object
 */
function View(tag, attrs) {
  if (attrs === undefined)
    attrs = {}
  this.actions = {}
  this.parent = this.parent || 'body'
  this.element = document.createElement(tag)
  for (attr in attrs)
    this.element.setAttribute(attr, attrs[attr])
  this.element.onclick = this.onClick
  this.element.onkeypress = this.onKeypress
  if (this.init !== undefined)
    this.init()
}

/**
 * Create a new object that extends View
 *
 * @param tag Name of HTML tag
 * @param attrs attributes for new object
 */
View.prototype.extend = function(tag, props) {
  var V = function(attrs) {
    View.call(this, tag, attrs)
  }
  V.prototype = Object.create(View.prototype)
  for (p in props)
    V.prototype[p] = props[p]
  return V
}

/**
 * Declare the content to display
 */
View.prototype.content = function() { return '' }

/**
 * Render html into DOM
 *
 * @param parent CSS selector for node to insert View into
 */
View.prototype.render = function() {
  this.element.innerHTML = this.content()
  var p = document.querySelector(this.parent)
  p.innerHTML = ''
  p.appendChild(this.element)
}

View.prototype.on = function(event, fn) {
  var todos = this.actions[event]
  if (!!todos)
    todos.push(fn)
  else
    this.actions[event] = [fn]
}

View.prototype.trigger = function(event, data) {
  var todos = this.actions[event]
  if (!!todos)
    todos.forEach(function(todo) {
      todo(data)
    })
}
