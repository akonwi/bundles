(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
'use strict';
Object.defineProperty(exports, '__esModule', {
  value: true
});

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

var storage = chrome.storage.sync;
var runtime = chrome.runtime;

var ChromeStorage = {};
Object.defineProperties(ChromeStorage, {
  _VERSION: {
    value: '0.0.2'
  },

  /**
   * @param callback to run when data changes
   *   function(changes) {}
   */
  onChange: {
    value: function value(listener) {
      chrome.storage.onChanged.addListener(listener);
    }
  },

  /**
   * @param callback to remove from data changes
   */
  unsubscribe: {
    value: function value(listener) {
      chrome.storage.onChanged.removeListener(listener);
    }
  },

  /**
   * Save something
   *
   * @param key String key name
   * @param val Any object to save with key
   */
  set: {
    value: function value(key, val) {
      var toSave = _defineProperty({}, key, val);
      return new Promise(function (resolve, reject) {
        storage.set(toSave, function () {
          if (runtime.lastError) return reject(runtime.lastError);
          resolve(val);
        });
      });
    }
  },

  /**
   * Retrieve data
   *
   * @param key String of key or Array of keys to retrieve
   *   If given one key, it resolves to just the value
   *   If given an array of keys, it resolves to an object with key/value pairs
   */
  get: {
    value: function value(key) {
      return new Promise(function (resolve, reject) {
        storage.get(key, function (results) {
          if (key.trim !== undefined) results = results[key];
          if (runtime.lastError) return reject(runtime.lastError);
          resolve(results);
        });
      });
    }
  },

  /**
   * Retrieve total collection
   *
   * resolves to an object with key/value pairs
   */
  all: {
    value: function value() {
      return new Promise(function (resolve, reject) {
        storage.get(null, function (items) {
          if (runtime.lastError) return reject(runtime.lastError);
          resolve(items);
        });
      });
    }
  },

  /**
   * Delete data at a key
   *
   * @param key String of key
   */
  remove: {
    value: function value(key) {
      if (key === undefined) throw new Error("No keys given to remove");
      return new Promise(function (resolve, reject) {
        storage.remove(key, function () {
          if (runtime.lastError) return reject(runtime.lastError);
          resolve();
        });
      });
    }
  }
});
Object.preventExtensions(ChromeStorage);

exports['default'] = ChromeStorage;
module.exports = exports['default'];

},{}],2:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, '__esModule', {
  value: true
});
exports.addBundle = addBundle;
exports.addLinkToBundle = addLinkToBundle;
exports.updateBundle = updateBundle;
exports.removeBundle = removeBundle;

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

var _libChromeStorage = require('../lib/chrome-storage');

var _libChromeStorage2 = _interopRequireDefault(_libChromeStorage);

var _bundle = require('./bundle');

function addBundle(name) {
  _libChromeStorage2['default'].set(name, (0, _bundle.create)({ name: name }))['catch'](function (err) {
    console.error(err);
  });
}

function addLinkToBundle(name, link) {
  _libChromeStorage2['default'].get(name).then(function (bundle) {
    bundle.links.push(link);
    _libChromeStorage2['default'].set(name, bundle);
  })['catch'](function (err) {
    console.error(err);
  });
}

function updateBundle(name, bundle) {
  _libChromeStorage2['default'].set(name, bundle)['catch'](function (err) {
    console.error(err);
  });
}

function removeBundle(name) {
  _libChromeStorage2['default'].remove(name)['catch'](function (err) {
    console.error(err);
  });
}

},{"../lib/chrome-storage":1,"./bundle":3}],3:[function(require,module,exports){
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

},{}],4:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, '__esModule', {
  value: true
});

exports['default'] = function (_ref) {
  var url = _ref.url;
  var title = _ref.title;

  var openLink = function openLink(e) {
    e.preventDefault();
    chrome.tabs.create({ url: url });
  };

  return React.createElement(function () {
    return {
      render: function render() {
        return React.createElement(
          'li',
          { title: title },
          React.createElement(
            'a',
            { href: '#', onClick: openLink },
            title
          )
        );
      }
    };
  });
};

module.exports = exports['default'];

},{}],5:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, '__esModule', {
  value: true
});

exports['default'] = function (Core) {
  return React.createClass({
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
};

module.exports = exports['default'];

},{}],6:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, '__esModule', {
  value: true
});

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

var _newBundleInputJsx = require('./new-bundle-input.jsx');

var _newBundleInputJsx2 = _interopRequireDefault(_newBundleInputJsx);

exports['default'] = function (Core) {
  return React.createClass({
    getInitialState: function getInitialState() {
      return { showInput: false };
    },
    componentDidMount: function componentDidMount() {
      var _this = this;

      Core.on('show-new-bundle-input', function () {
        _this.setState({ showInput: true });
      });
      Core.on('hide-new-bundle-input', function () {
        _this.setState({ showInput: false });
      });
    },
    render: function render() {
      var NewBundleInput = (0, _newBundleInputJsx2['default'])(Core);
      if (this.state.showInput) return React.createElement(NewBundleInput, null);else return React.createElement(
        'h2',
        { className: 'logo' },
        'Bundles'
      );
    }
  });
};

module.exports = exports['default'];

},{"./new-bundle-input.jsx":8}],7:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, '__esModule', {
  value: true
});

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

var _createBundleBtnJsx = require('./create-bundle-btn.jsx');

var _createBundleBtnJsx2 = _interopRequireDefault(_createBundleBtnJsx);

var _logoInputJsx = require('./logo-input.jsx');

var _logoInputJsx2 = _interopRequireDefault(_logoInputJsx);

exports['default'] = function (Core) {
  return React.createElement(function () {
    return {
      render: function render() {
        var CreateBundleBtn = (0, _createBundleBtnJsx2['default'])(Core);
        var LogoInput = (0, _logoInputJsx2['default'])(Core);
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
  });
};

module.exports = exports['default'];

},{"./create-bundle-btn.jsx":5,"./logo-input.jsx":6}],8:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, '__esModule', {
  value: true
});

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj['default'] = obj; return newObj; } }

var _bundleStore = require('../bundle-store');

var BundleStore = _interopRequireWildcard(_bundleStore);

exports['default'] = function (Core) {
  return React.createClass({
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
};

module.exports = exports['default'];

},{"../bundle-store":2}],9:[function(require,module,exports){
'use strict';

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj['default'] = obj; return newObj; } }

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

var _libChromeStorage = require('../lib/chrome-storage');

var _libChromeStorage2 = _interopRequireDefault(_libChromeStorage);

var _bundle = require('./bundle');

var Bundle = _interopRequireWildcard(_bundle);

var _bundleStore = require('./bundle-store');

var BundleStore = _interopRequireWildcard(_bundleStore);

var _componentsNavbarJsx = require('./components/navbar.jsx');

var _componentsNavbarJsx2 = _interopRequireDefault(_componentsNavbarJsx);

var _componentsBundleLinkJsx = require('./components/bundle-link.jsx');

var _componentsBundleLinkJsx2 = _interopRequireDefault(_componentsBundleLinkJsx);

(function () {
  var cx = React.addons.classSet;
  var createElement = React.createElement;

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

  var BundleList = React.createClass({
    displayName: 'BundleList',

    getInitialState: function getInitialState() {
      return { bundles: this.props.bundles };
    },
    componentDidMount: function componentDidMount() {
      var _this = this;

      _libChromeStorage2['default'].onChange(function (changes) {
        _libChromeStorage2['default'].all().then(function (bundles) {
          return _this.setState({ bundles: bundles });
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
      var _this2 = this;

      e.preventDefault();
      chrome.tabs.getSelected(null, function (_ref3) {
        var title = _ref3.title;
        var url = _ref3.url;

        BundleStore.addLinkToBundle(_this2.props.bundle.name, { title: title, url: url });
        _this2.setState({ shouldFlash: true });
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
            return (0, _componentsBundleLinkJsx2['default'])(link);
          })
        )
      );
    }
  });

  _libChromeStorage2['default'].all().then(function (data) {
    React.render(React.createElement(BundleList, { bundles: data }), document.querySelector('.content'));
    React.render((0, _componentsNavbarJsx2['default'])(Core), document.querySelector('.navbar'));
  })['catch'](function (error) {
    console.error("Couldn't start the app due to: " + error);
  });
})();

},{"../lib/chrome-storage":1,"./bundle":3,"./bundle-store":2,"./components/bundle-link.jsx":4,"./components/navbar.jsx":7}]},{},[1,9,3,2]);
