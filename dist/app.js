(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, '__esModule', {
  value: true
});

function _defineProperty(obj, key, value) {
  if (key in obj) {
    Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true });
  } else {
    obj[key] = value;
  }return obj;
}

var version = { value: '0.0.4' };

exports['default'] = function () {
  var type = arguments.length <= 0 || arguments[0] === undefined ? null : arguments[0];
  var _chrome = chrome;
  var runtime = _chrome.runtime;

  var storage = null;

  if (type === null) throw new Error("Please specify which type of storage to use. (local or sync)");
  if (type === "local") storage = chrome.storage.local;else if (type === "sync") storage = chrome.storage.sync;

  var ChromeStorage = {};
  Object.defineProperties(ChromeStorage, {
    _VERSION: version,

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
  return Object.preventExtensions(ChromeStorage);
};

module.exports = exports['default'];


},{}],2:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, '__esModule', {
  value: true
});
exports.get = get;
exports.save = save;
exports.add = add;
exports.addLinkToBundle = addLinkToBundle;
exports.updateBundle = updateBundle;
exports.remove = remove;

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

var _libChromeStorage = require('../lib/chrome-storage');

var _libChromeStorage2 = _interopRequireDefault(_libChromeStorage);

var _bundle = require('./bundle');

var storage = (0, _libChromeStorage2['default'])('sync');
var BUNDLES = 'bundles';

function get() {
  return storage.get(BUNDLES).then(function (bundles) {
    return bundles || {};
  });
}

function save(bundles) {
  return storage.set(BUNDLES, bundles);
}

function add(_ref) {
  var id = _ref.id;
  var name = _ref.name;
  var links = _ref.links;

  storage.get(BUNDLES).then(function () {
    var bundles = arguments.length <= 0 || arguments[0] === undefined ? {} : arguments[0];

    bundles[id] = { id: id, name: name, links: links };
    return bundles;
  }).then(save)['catch'](function (err) {
    console.error(err);
  });
}

function addLinkToBundle(name, link) {
  storage.get(name).then(function (bundle) {
    bundle.links.push(link);
    storage.set(name, bundle);
  })['catch'](function (err) {
    console.error(err);
  });
}

function updateBundle(name, bundle) {
  storage.set(name, bundle)['catch'](function (err) {
    console.error(err);
  });
}

function remove(id) {
  get().then(function (bundles) {
    delete bundles[id];
    return bundles;
  }).then(save)['catch'](function (err) {
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

function extend(target) {
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
  return extend(Bundle, attrs);
}

},{}],4:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, '__esModule', {
  value: true
});
exports.CreateBundle = CreateBundle;
exports.DeleteBundle = DeleteBundle;

function CreateBundle(_ref) {
  var name = _ref.name;

  return { name: 'CreateBundle', message: { name: name } };
}

function DeleteBundle(_ref2) {
  var id = _ref2.id;

  return { name: 'DeleteBundle', message: { id: id } };
}

},{}],5:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, '__esModule', {
  value: true
});

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj['default'] = obj; return newObj; } }

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

var _bundleLinkJsx = require('./bundle-link.jsx');

var _bundleLinkJsx2 = _interopRequireDefault(_bundleLinkJsx);

var _bundle = require('../bundle');

var Bundle = _interopRequireWildcard(_bundle);

var _bundleStore = require('../bundle-store');

var BundleStore = _interopRequireWildcard(_bundleStore);

var _commands = require('../commands');

exports['default'] = function (_ref) {
  var id = _ref.id;
  var name = _ref.name;
  var open = _ref.open;
  var links = _ref.links;
  var dispatch = _ref.dispatch;

  var toggle = function toggle(e) {
    var bundle = Bundle.create({ name: name, links: links, open: !open });
    BundleStore.updateBundle(name, bundle);
  };

  var openLinks = function openLinks(e) {
    links.forEach(function (_ref2) {
      var url = _ref2.url;
      chrome.tabs.create({ url: url });
    });
  };

  var addLink = function addLink(e) {
    chrome.tabs.getSelected(null, function (_ref3) {
      var title = _ref3.title;
      var url = _ref3.url;

      BundleStore.addLinkToBundle(name, { title: title, url: url });
    });
  };

  var deleteBundle = function deleteBundle(e) {
    return dispatch((0, _commands.DeleteBundle)({ id: id }));
  };

  var linksClasses = classNames({
    links: true,
    open: open
  });

  var triangleClasses = classNames({
    triangle: true,
    down: open
  });

  var bundleLinks = links.map(function (_ref4) {
    var url = _ref4.url;
    var title = _ref4.title;

    return React.createElement(_bundleLinkJsx2['default'], { url: url, title: title });
  });

  return React.createElement(
    'li',
    { className: 'bundle' },
    React.createElement(
      'div',
      { className: 'title-bar' },
      React.createElement('div', { className: triangleClasses }),
      React.createElement(
        'h4',
        { onClick: toggle },
        name
      ),
      React.createElement(
        'div',
        { className: 'controls' },
        React.createElement(
          'a',
          { href: '#', className: 'btn', title: 'Open all' },
          React.createElement(
            'i',
            { className: 'material-icons', onClick: openLinks },
            'launch'
          )
        ),
        React.createElement(
          'a',
          { href: '#', className: 'btn', title: 'Add current page' },
          React.createElement(
            'i',
            { className: 'material-icons', onClick: addLink },
            'add'
          )
        ),
        React.createElement(
          'a',
          { href: '#', className: 'btn', title: 'Delete' },
          React.createElement(
            'i',
            { className: 'material-icons', onClick: deleteBundle },
            'delete'
          )
        )
      )
    ),
    React.createElement(
      'ul',
      { className: linksClasses },
      bundleLinks
    )
  );
};

module.exports = exports['default'];

},{"../bundle":3,"../bundle-store":2,"../commands":4,"./bundle-link.jsx":6}],6:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, '__esModule', {
  value: true
});

exports['default'] = function (_ref) {
  var url = _ref.url;
  var title = _ref.title;

  var openLink = function openLink(e) {
    chrome.tabs.create({ url: url });
  };

  return React.createElement(
    'li',
    { title: title },
    React.createElement(
      'a',
      { href: '#', onClick: openLink },
      title
    )
  );
};

module.exports = exports['default'];

},{}],7:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, '__esModule', {
  value: true
});

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

var _bundleItemJsx = require('./bundle-item.jsx');

var _bundleItemJsx2 = _interopRequireDefault(_bundleItemJsx);

exports['default'] = function (_ref) {
  var bundles = _ref.bundles;
  var dispatch = _ref.dispatch;

  var bundleItems = Object.keys(bundles).map(function (id) {
    var item = bundles[id];
    return React.createElement(_bundleItemJsx2['default'], { dispatch: dispatch, id: id, name: item.name, open: item.open, links: item.links });
  });

  return React.createElement(
    'ul',
    { className: 'bundles' },
    bundleItems
  );
};

module.exports = exports['default'];

},{"./bundle-item.jsx":5}],8:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, '__esModule', {
  value: true
});

exports['default'] = function (_ref) {
  var isCreating = _ref.isCreating;
  var onClick = _ref.onClick;

  var text = isCreating ? 'Cancel' : 'New';
  return React.createElement(
    'a',
    { className: 'nav-btn', href: '#', onClick: onClick },
    text
  );
};

module.exports = exports['default'];

},{}],9:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, '__esModule', {
  value: true
});

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

var _createBundleBtnJsx = require('./create-bundle-btn.jsx');

var _createBundleBtnJsx2 = _interopRequireDefault(_createBundleBtnJsx);

var _newBundleInputJsx = require('./new-bundle-input.jsx');

var _newBundleInputJsx2 = _interopRequireDefault(_newBundleInputJsx);

exports['default'] = function (_ref) {
  var dispatch = _ref.dispatch;
  var isCreating = _ref.isCreating;
  var toggleCreating = _ref.toggleCreating;

  var logoInput = isCreating ? React.createElement(_newBundleInputJsx2['default'], { dispatch: dispatch }) : React.createElement(
    'h2',
    { className: 'logo' },
    'Bundles'
  );
  return React.createElement(
    'div',
    null,
    React.createElement('div', { className: 'nav-block small left' }),
    React.createElement(
      'div',
      { className: 'nav-block big' },
      logoInput
    ),
    React.createElement(
      'div',
      { className: 'nav-block small right' },
      React.createElement(_createBundleBtnJsx2['default'], { isCreating: isCreating, onClick: toggleCreating })
    )
  );
};

module.exports = exports['default'];

},{"./create-bundle-btn.jsx":8,"./new-bundle-input.jsx":10}],10:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, '__esModule', {
  value: true
});

var _commands = require('../commands');

exports['default'] = function (_ref) {
  var dispatch = _ref.dispatch;

  var onKeyUp = function onKeyUp(_ref2) {
    var keyCode = _ref2.keyCode;
    var target = _ref2.target;

    if (keyCode === 13) {
      var _name = target.value.trim();
      if (_name.length > 0) dispatch((0, _commands.CreateBundle)({ name: _name }));
    }
  };

  return React.createElement('input', { className: 'new-bundle-input', autoFocus: true, onKeyUp: onKeyUp, type: 'text', placeholder: 'Bundle name...' });
};

module.exports = exports['default'];

},{"../commands":4}],11:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, '__esModule', {
  value: true
});
exports.add = add;
exports.getEvents = getEvents;

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

var _libChromeStorage = require('../lib/chrome-storage');

var _libChromeStorage2 = _interopRequireDefault(_libChromeStorage);

var storage = (0, _libChromeStorage2['default'])('sync');
var EVENTS = 'events';

var save = function save(events) {
  return storage.set(EVENTS, events);
};

function add(event) {
  getEvents().then(function (events) {
    events.push(event);
    return events;
  }).then(save);
}

function getEvents() {
  return storage.get(EVENTS).then(function (events) {
    return events || [];
  });
}

},{"../lib/chrome-storage":1}],12:[function(require,module,exports){
'use strict';

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj['default'] = obj; return newObj; } }

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

var _libChromeStorage = require('../lib/chrome-storage');

var _libChromeStorage2 = _interopRequireDefault(_libChromeStorage);

var _bundleStore = require('./bundle-store');

var BundleStore = _interopRequireWildcard(_bundleStore);

var _eventStore = require('./event-store');

var BundleEventStore = _interopRequireWildcard(_eventStore);

var _componentsNavbarJsx = require('./components/navbar.jsx');

var _componentsNavbarJsx2 = _interopRequireDefault(_componentsNavbarJsx);

var _componentsBundleListJsx = require('./components/bundle-list.jsx');

var _componentsBundleListJsx2 = _interopRequireDefault(_componentsBundleListJsx);

var _commands = require('./commands');

var Commands = _interopRequireWildcard(_commands);

(function () {
  var _BundleCommandHandlers;

  // taken from: https://gist.github.com/jed/982883
  var idGenerator = function idGenerator(a) {
    return a ? (a ^ Math.random() * 16 >> a / 4).toString(16) : ([1e7] + -1e3 + -4e3 + -8e3 + -1e11).replace(/[018]/g, idGenerator);
  };

  var Bundle = eventuality.defineAggregate({
    idGenerator: idGenerator,
    name: 'Bundle',
    state: {
      links: [],
      name: null
    },
    methods: {}
  });

  var BundleRepository = eventuality.Repository('Bundle', Bundle, BundleEventStore);

  var BundleCommandHandlers = (_BundleCommandHandlers = {}, _defineProperty(_BundleCommandHandlers, Commands.CreateBundle.name, function (_ref) {
    var name = _ref.name;

    return BundleRepository.add({ name: name });
  }), _defineProperty(_BundleCommandHandlers, Commands.DeleteBundle.name, function (_ref2) {
    var id = _ref2.id;

    return BundleRepository['delete'](id);
  }), _BundleCommandHandlers);

  var BundleEventBus = eventuality.EventBus();

  var BundleCreatedEventListener = function BundleCreatedEventListener(event) {
    BundleStore.add(Object.assign({}, event.state, { id: event.aggregateId }));
  };

  var BundleDeletedEventListener = function BundleDeletedEventListener(event) {
    BundleStore.remove(event.aggregateId);
  };

  BundleEventBus.registerListeners({
    BundleCreatedEvent: [BundleCreatedEventListener],
    BundleDeletedEvent: [BundleDeletedEventListener]
  });

  var BundleFlow = eventuality.Flow({
    eventBus: BundleEventBus,
    eventStore: BundleEventStore,
    commandHandlers: BundleCommandHandlers
  });

  var isCreating = false;

  var renderNavbar = function renderNavbar() {
    ReactDOM.render(React.createElement(_componentsNavbarJsx2['default'], { dispatch: BundleFlow.dispatch, isCreating: isCreating, toggleCreating: toggleCreating }), document.querySelector('.navbar'));
  };

  var renderBundlelist = function renderBundlelist() {
    return BundleStore.get().then(function (bundles) {
      ReactDOM.render(React.createElement(_componentsBundleListJsx2['default'], { bundles: bundles, dispatch: BundleFlow.dispatch }), document.querySelector('.content'));
    })['catch'](function (error) {
      return console.error("Couldn't render BundleList: " + error);
    });
  };

  var toggleCreating = function toggleCreating() {
    isCreating = !isCreating;
    renderNavbar();
  };

  var storage = (0, _libChromeStorage2['default'])('sync');
  storage.onChange(function (changes) {
    Object.keys(changes).some(function (key) {
      if (key === 'bundles') {
        renderBundlelist();
        if (isCreating) {
          toggleCreating();
          return true;
        }
      }
    });
  });

  renderNavbar();
  renderBundlelist();
})();

},{"../lib/chrome-storage":1,"./bundle-store":2,"./commands":4,"./components/bundle-list.jsx":7,"./components/navbar.jsx":9,"./event-store":11}]},{},[1,4,12,3,2]);
