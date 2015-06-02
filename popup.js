'use strict';

(function () {
  var cx = React.addons.classSet;
  var Core = {
    actions: {},
    on: function on(event, fn) {
      var ctx = arguments[2] === undefined ? this : arguments[2];

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

  /**
    * Not a class but factory function to create bundle objects.
    * Bundles consist of 'name', 'open', and 'links' attributes.
    * @param attributes {Object}
    */
  var Bundle = function Bundle(_ref2) {
    var name = _ref2.name;
    var _ref2$open = _ref2.open;
    var open = _ref2$open === undefined ? false : _ref2$open;
    var _ref2$links = _ref2.links;
    var links = _ref2$links === undefined ? [] : _ref2$links;

    if (name === undefined) throw new Error('Cannot create a bundle without a name.');
    return { name: name, links: links, open: open };
  };

  var BundleStore = {
    subscribers: [],
    init: function init() {
      ChromeStorage.onChange(function (changes) {
        ChromeStorage.all().then(function (data) {
          BundleStore.subscribers.forEach(function (s) {
            s.setState({ bundles: data });
          });
        });
      });
    },
    // Returns mixin for component use
    Subscriber: function Subscriber() {
      var self = this;
      return {
        componentDidMount: function componentDidMount() {
          self.subscribers.push(this);
        }
      };
    },
    addBundle: function addBundle(name) {
      var b = Bundle({ name: name });
      ChromeStorage.set(name, b)['catch'](function (err) {
        console.error(err);
      });
    },
    addLinkToBundle: function addLinkToBundle(name, link) {
      ChromeStorage.get(name).then(function (bundle) {
        bundle.links.push(link);
        return ChromeStorage.set(name, bundle);
      })['catch'](function (err) {
        console.error(err);
      });
    },
    updateBundle: function updateBundle(name, bundle) {
      ChromeStorage.set(name, bundle)['catch'](function (err) {
        console.error(err);
      });
    },
    removeBundle: function removeBundle(name) {
      ChromeStorage.remove(name)['catch'](function (err) {
        console.error(err);
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
      var _this = this;

      Core.on('show-new-bundle-input', function () {
        _this.setState({ showInput: true });
      });
      Core.on('hide-new-bundle-input', function () {
        _this.setState({ showInput: false });
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

    mixins: [BundleStore.Subscriber()],
    getInitialState: function getInitialState() {
      return { bundles: this.props.bundles };
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
      var b = Bundle({
        name: bundle.name,
        open: !bundle.open,
        links: bundle.links
      });
      BundleStore.updateBundle(bundle.name, b);
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
          React.createElement('img', { className: 'icon', onClick: this.addLink, src: '/assets/plus.svg' }),
          React.createElement('img', { className: 'icon', onClick: this.deleteBundle, src: '/assets/cross.svg' })
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
    BundleStore.init();
    React.render(React.createElement(BundleList, { bundles: data }), document.querySelector('.content'));
    React.render(React.createElement(Navbar, null), document.querySelector('.navbar'));
  })['catch'](function (error) {
    console.error(error);
  });
})();
//# sourceMappingURL=popup.js.map