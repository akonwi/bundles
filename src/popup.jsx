import {create, SYNC} from '../lib/chrome-storage'
import * as BundleStore from './bundle-store'
import * as BundleEventStore from './event-store'
import Navbar from './components/Navbar.jsx'
import BundleList from './components/BundleList.jsx'
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
    methods: {
      addLink(link) {
        this.state.links.push(link)
        return eventuality.Event({name: 'LinkAddedToBundleEvent', aggregateId: this.id, payload: link, state: this.state})
      }
    }
  })

  const BundleRepository = eventuality.Repository('Bundle', Bundle, BundleEventStore)

  const BundleCommandHandlers = {
    [Commands.CreateBundle.name]: ({name}) => {
      return BundleRepository.add({name})
    },
    [Commands.DeleteBundle.name]: ({id}) => {
      return BundleRepository.delete(id)
    },
    [Commands.AddLink.name]: ({id, title, url}) => {
      return BundleRepository.load(id).then(bundle => bundle.addLink({title, url}))
    }
  }

  const BundleEventBus = eventuality.EventBus()

  const BundleCreatedEventListener = event => {
    BundleStore.add(Object.assign({}, event.state, {id: event.aggregateId}))
  }

  const BundleDeletedEventListener = event => {
    BundleStore.remove(event.aggregateId)
  }

  const LinkAddedToBundleEventListener = event => {
    BundleStore.addLinkToBundle(event.aggregateId, event.payload)
  }

  BundleEventBus.registerListeners({
    BundleCreatedEvent: [BundleCreatedEventListener],
    BundleDeletedEvent: [BundleDeletedEventListener],
    LinkAddedToBundleEvent: [LinkAddedToBundleEventListener]
  })

  const BundleFlow = eventuality.Flow({
    eventBus: BundleEventBus,
    eventStore: BundleEventStore,
    commandHandlers: BundleCommandHandlers
  })

  let isCreating = false

  const toggleCreating = () => {
    isCreating = !isCreating
    renderNavbar()
  }

  const renderNavbar = () => {
    ReactDOM.render(<Navbar dispatch={BundleFlow.dispatch} isCreating={isCreating} toggleCreating={toggleCreating}/>, document.querySelector('.navbar'))
  }

  const renderBundlelist = () => {
    return BundleStore.get().then(bundles => {
      ReactDOM.render(<BundleList bundles={bundles} dispatch={BundleFlow.dispatch}/>, document.querySelector('.content'))
    })
    .catch(error => console.error("Couldn't render BundleList: " + error) )
  }


  const storage = create(SYNC)
  storage.onChange(changes => {
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
