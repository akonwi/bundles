import React from 'react'
import ReactDOM from 'react-dom'
import {defineAggregate, Event, Repository, EventBus, Flow} from 'qubits'
import App from './components/App'
import * as BundleStore from './bundle-store'
import * as BundleEventStore from './event-store'
import BundleCommandHandlers from './command-handlers'
import BundleEventListeners from './event-listeners'
import * as Commands from './commands'

(() => {
  // taken from: https://gist.github.com/jed/982883
  const idGenerator = (a) => a?(a^Math.random()*16>>a/4).toString(16):([1e7]+-1e3+-4e3+-8e3+-1e11).replace(/[018]/g,idGenerator)

  const Bundle = defineAggregate({
    idGenerator,
    name: 'Bundle',
    state: {
      links: [],
      name: null
    },
    methods: {
      addLink(link) {
        this.state.links.push(link)
        return Event({name: 'LinkAddedToBundleEvent', aggregateId: this.id, payload: link, state: this.state})
      }
    }
  })

  const BundleRepository = Repository('Bundle', Bundle, BundleEventStore)


  const BundleEventBus = EventBus()

  BundleEventBus.registerListeners(BundleEventListeners(BundleStore))

  const BundleFlow = Flow({
    eventBus: BundleEventBus,
    eventStore: BundleEventStore,
    commandHandlers: BundleCommandHandlers(BundleRepository)
  })

  ReactDOM.render(<App dispatch={BundleFlow.dispatch}/>, document.querySelector('.main'))
})()