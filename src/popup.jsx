import ChromeStorage from '../lib/chrome-storage'
import * as BundleStore from './bundle-store'
import Navbar from './components/navbar.jsx'
import BundleList from './components/bundle-list.jsx'
import * as Commands from './commands'

(() => {
  // taken from: https://gist.github.com/jed/982883
  const idGenerator = (a) => a?(a^Math.random()*16>>a/4).toString(16):([1e7]+-1e3+-4e3+-8e3+-1e11).replace(/[018]/g,idGenerator)

  const Bundle = eventuality.defineAggregate({
    idGenerator,
    name: 'Bundle',
    state: {
      links: [],
      name: null
    },
    methods: {}
  })

  const BundleEventStore = eventuality.EventStore()

  const BundleRepository = eventuality.Repository('Bundle', Bundle, BundleEventStore)

  const BundleCommandHandlers = {
    [Commands.CreateBundle.name]: ({name}) => BundleRepository.add({name})
  }

  const BundleEventBus = eventuality.EventBus()

  const BundleCreatedEventListener = event => BundleStore.addBundle(event.state)

  BundleEventBus.registerListeners({
    BundleCreatedEvent: [BundleCreatedEventListener]
  })

  const BundleFlow = eventuality.Flow({
    eventBus: BundleEventBus,
    eventStore: BundleEventStore,
    commandHandlers: BundleCommandHandlers
  })

  let isCreating = false

  const renderNavbar = () => {
    ReactDOM.render(<Navbar flow={BundleFlow} isCreating={isCreating} toggleCreating={toggleCreating}/>, document.querySelector('.navbar'))
  }

  const renderBundlelist = () => {
    return BundleStore.get().then((bundles) => {
      ReactDOM.render(<BundleList bundles={bundles}/>, document.querySelector('.content'))
    })
    .catch(error => console.error("Couldn't render BundleList: " + error) )
  }

  const toggleCreating = () => {
    isCreating = !isCreating
    renderNavbar()
  }

  ChromeStorage.onChange(changes => {
    Object.keys(changes).some(key => {
      if (key === 'bundles') {
        renderBundlelist()
        if (isCreating) {
          toggleCreating()
          return true
        }
      }
    })
  })

  renderNavbar()
  renderBundlelist()
})()
