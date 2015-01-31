/**
 * View object
 *
 * @param tag Name of HTML tag
 * @param content
 * @param [{attrs}] HTML attributes in an object
 */
function View(tag, attrs) {
  if (attrs === undefined)
    attrs = {}
  this.actions = []
  this.element = document.createElement(tag)
  for (attr in attrs)
    this.element.setAttribute(attr, attrs[attr])
}

/**
 * Create a new object that extends View
 *
 * @param tag Name of HTML tag
 * @param attrs attributes for new object
 */
View.prototype.extend = function(tag, attrs) {
  var V = function(attrs) {
    View.call(this, tag, attrs)
  }
  V.prototype = Object.create(View.prototype)
  for (attr in attrs)
    V.prototype[attr] = attrs[attr]
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
View.prototype.render = function(parent) {
  this.element.innerHTML = this.content()
  document.querySelector(parent).innerHTML = this.element.outerHTML
}

