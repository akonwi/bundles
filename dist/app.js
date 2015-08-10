(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, '__esModule', {
  value: true
});
exports.addBundle = addBundle;
exports.addLinkToBundle = addLinkToBundle;
exports.updateBundle = updateBundle;
exports.removeBundle = removeBundle;

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj['default'] = obj; return newObj; } }

var _bundle = require('./bundle');

var Bundle = _interopRequireWildcard(_bundle);

function addBundle(name) {
  var b = Bundle.create({ name: name });
  ChromeStorage.set(name, b)['catch'](function (err) {
    console.error(err);
  });
}

function addLinkToBundle(name, link) {
  ChromeStorage.get(name).then(function (bundle) {
    bundle.links.push(link);
    return ChromeStorage.set(name, bundle);
  })['catch'](function (err) {
    console.error(err);
  });
}

function updateBundle(name, bundle) {
  ChromeStorage.set(name, bundle)['catch'](function (err) {
    console.error(err);
  });
}

function removeBundle(name) {
  ChromeStorage.remove(name)['catch'](function (err) {
    console.error(err);
  });
}

},{"./bundle":2}],2:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.create = create;

function _toConsumableArray(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) arr2[i] = arr[i]; return arr2; } else { return Array.from(arr); } }

var Bundle = {
  name: undefined,
  links: [],
  open: false
};

function assign(target) {
  for (var _len = arguments.length, sources = Array(_len > 1 ? _len - 1 : 0), _key = 1; _key < _len; _key++) {
    sources[_key - 1] = arguments[_key];
  }

  var obj = {};
  sources = [target].concat(_toConsumableArray(sources));
  sources.forEach(function (source) {
    Object.keys(source).forEach(function (key) {
      return obj[key] = source[key];
    });
  });
  return obj;
}

function create(attrs) {
  if (attrs.name === undefined) throw new Error("Cannot create a bundle without a name.");
  return assign(Bundle, attrs);
}

},{}],3:[function(require,module,exports){
'use strict';

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj['default'] = obj; return newObj; } }

var _bundle = require('./bundle');

var Bundle = _interopRequireWildcard(_bundle);

var _bundleStore = require('./bundle-store');

var BundleStore = _interopRequireWildcard(_bundleStore);

(function () {
  var cx = React.addons.classSet;
  var Core = {
    actions: {},
    on: function on(event, fn) {
      var ctx = arguments.length <= 2 || arguments[2] === undefined ? this : arguments[2];

      var todos = this.actions[event];
      var todo = { fn: fn, ctx: ctx };
      if (!!todos) todos.push(todo);else this.actions[event] = [todo];
    },
    trigger: function trigger(event, data) {
      var todos = this.actions[event];
      if (!!todos) todos.forEach(function (_ref) {
        var fn = _ref.fn;
        var ctx = _ref.ctx;

        fn.call(ctx, data);
      });
    }
  };

  var Navbar = function Navbar() {
    return {
      render: function render() {
        return React.createElement(
          'div',
          null,
          React.createElement('div', { className: 'nav-block small left' }),
          React.createElement(
            'div',
            { className: 'nav-block big' },
            React.createElement(LogoInput, null)
          ),
          React.createElement(
            'div',
            { className: 'nav-block small right' },
            React.createElement(CreateBundleBtn, null)
          )
        );
      }
    };
  };

  var CreateBundleBtn = React.createClass({
    displayName: 'CreateBundleBtn',

    getInitialState: function getInitialState() {
      return { showCancel: false };
    },
    componentDidMount: function componentDidMount() {
      var _this = this;

      Core.on('hide-new-bundle-input', function () {
        return _this.setState({ showCancel: false });
      });
    },
    onClick: function onClick(e) {
      e.preventDefault();
      if (!this.state.showCancel) {
        Core.trigger('show-new-bundle-input');
        this.setState({ showCancel: true });
      } else {
        Core.trigger('hide-new-bundle-input');
        this.setState({ showCancel: false });
      }
    },
    render: function render() {
      var text = this.state.showCancel ? 'Cancel' : 'New';
      return React.createElement(
        'a',
        { className: 'nav-btn', href: '#', onClick: this.onClick },
        text
      );
    }
  });

  var LogoInput = React.createClass({
    displayName: 'LogoInput',

    getInitialState: function getInitialState() {
      return { showInput: false };
    },
    componentDidMount: function componentDidMount() {
      var _this2 = this;

      Core.on('show-new-bundle-input', function () {
        _this2.setState({ showInput: true });
      });
      Core.on('hide-new-bundle-input', function () {
        _this2.setState({ showInput: false });
      });
    },
    render: function render() {
      if (this.state.showInput) return React.createElement(NewBundleInput, null);else return React.createElement(
        'h2',
        { className: 'logo' },
        'Bundles'
      );
    }
  });

  var NewBundleInput = React.createClass({
    displayName: 'NewBundleInput',

    onKeyUp: function onKeyUp(e) {
      if (e.keyCode === 13) {
        var _name = e.target.value;
        if (_name.trim().length > 0) {
          BundleStore.addBundle(_name);
          Core.trigger('hide-new-bundle-input');
        }
      }
    },
    componentDidMount: function componentDidMount() {
      this.getDOMNode().focus();
    },
    render: function render() {
      return React.createElement('input', { className: 'new-bundle-input', onKeyUp: this.onKeyUp, type: 'text', placeholder: 'Bundle name...' });
    }
  });

  var BundleList = React.createClass({
    displayName: 'BundleList',

    getInitialState: function getInitialState() {
      return { bundles: this.props.bundles };
    },
    componentDidMount: function componentDidMount() {
      var _this3 = this;

      ChromeStorage.onChange(function (changes) {
        ChromeStorage.all().then(function (bundles) {
          return _this3.setState({ bundles: bundles });
        });
      });
    },
    render: function render() {
      var bundles = this.state.bundles;
      return React.createElement(
        'ul',
        { className: 'bundles' },
        Object.keys(bundles).map(function (name) {
          return React.createElement(BundleItem, { bundle: bundles[name] });
        })
      );
    }
  });

  var BundleItem = React.createClass({
    displayName: 'BundleItem',

    getInitialState: function getInitialState() {
      return { shouldFlash: false };
    },
    onClick: function onClick(e) {
      e.preventDefault();
      var bundle = this.props.bundle;
      var b = Bundle.create({
        name: bundle.name,
        open: !bundle.open,
        links: bundle.links
      });
      BundleStore.updateBundle(bundle.name, b);
    },
    openLinks: function openLinks(e) {
      this.props.bundle.links.forEach(function (_ref2) {
        var url = _ref2.url;

        chrome.tabs.create({ url: url });
      });
    },
    addLink: function addLink(e) {
      var _this4 = this;

      e.preventDefault();
      chrome.tabs.getSelected(null, function (_ref3) {
        var title = _ref3.title;
        var url = _ref3.url;

        BundleStore.addLinkToBundle(_this4.props.bundle.name, { title: title, url: url });
        _this4.setState({ shouldFlash: true });
      });
    },
    deleteBundle: function deleteBundle(e) {
      e.preventDefault();
      BundleStore.removeBundle(this.props.bundle.name);
    },
    render: function render() {
      var linksClasses = cx({
        links: true,
        open: this.props.bundle.open
      });
      var triangleClasses = cx({
        triangle: true,
        down: this.props.bundle.open
      });
      var h4classes = this.state.shouldFlash ? 'flash' : '';
      return React.createElement(
        'li',
        { className: 'bundle' },
        React.createElement(
          'div',
          { className: 'title-bar' },
          React.createElement('div', { className: triangleClasses }),
          React.createElement(
            'h4',
            { className: h4classes, onClick: this.onClick },
            this.props.bundle.name
          ),
          React.createElement(
            'div',
            { className: 'controls' },
            React.createElement(
              'a',
              { href: '#', className: 'btn', title: 'Open all' },
              React.createElement(
                'i',
                { className: 'material-icons', onClick: this.openLinks },
                'launch'
              )
            ),
            React.createElement(
              'a',
              { href: '#', className: 'btn', title: 'Add current page' },
              React.createElement(
                'i',
                { className: 'material-icons', onClick: this.addLink },
                'add'
              )
            ),
            React.createElement(
              'a',
              { href: '#', className: 'btn', title: 'Delete' },
              React.createElement(
                'i',
                { className: 'material-icons', onClick: this.deleteBundle },
                'delete'
              )
            )
          )
        ),
        React.createElement(
          'ul',
          { className: linksClasses, ref: 'links' },
          this.props.bundle.links.map(function (link) {
            return React.createElement(BundleLink, { link: link });
          })
        )
      );
    }
  });

  var BundleLink = React.createClass({
    displayName: 'BundleLink',

    getInitialProps: function getInitialProps() {
      return { link: {} };
    },
    openLink: function openLink(e) {
      e.preventDefault();
      chrome.tabs.create({ url: this.props.link.url });
    },
    render: function render() {
      var link = this.props.link;
      return React.createElement(
        'li',
        { title: link.title },
        React.createElement(
          'a',
          { href: '#', onClick: this.openLink },
          link.title
        )
      );
    }
  });

  ChromeStorage.all().then(function (data) {
    React.render(React.createElement(BundleList, { bundles: data }), document.querySelector('.content'));
    React.render(React.createElement(Navbar, null), document.querySelector('.navbar'));
  })['catch'](function (error) {
    console.error("Couldn't start the app due to: " + error);
  });
})();

},{"./bundle":2,"./bundle-store":1}]},{},[3,2]);
