export default function(store) {
  const BundleCreatedEventListener = event => {
    store.add(Object.assign({}, event.payload, {id: event.aggregateId, links: []}))
  }

  const BundleEditedEventListener = event => {
    store.update(event.aggregateId, event.payload)
  }

  const BundleDeletedEventListener = event => {
    store.remove(event.aggregateId)
  }

  const LinkAddedToBundleEventListener = event => {
    store.addLinkToBundle(event.aggregateId, event.payload)
  }

  return {
    BundleCreatedEvent: [BundleCreatedEventListener],
    BundleEditedEvent: [BundleEditedEventListener],
    BundleDeletedEvent: [BundleDeletedEventListener],
    LinkAddedToBundleEvent: [LinkAddedToBundleEventListener]
  }
}
