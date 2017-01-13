export default function(store) {
  const BundleCreatedEventListener = event => {
    store.add(Object.assign({}, event.state, {id: event.aggregateId}))
  }

  const BundleDeletedEventListener = event => {
    store.remove(event.aggregateId)
  }

  const LinkAddedToBundleEventListener = event => {
    store.addLinkToBundle(event.aggregateId, event.payload)
  }

  return {
    BundleCreatedEvent: [BundleCreatedEventListener],
    BundleDeletedEvent: [BundleDeletedEventListener],
    LinkAddedToBundleEvent: [LinkAddedToBundleEventListener]
  }
}
