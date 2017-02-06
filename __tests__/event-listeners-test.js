import EventListeners from '../src/event-listeners'

describe("Event Listeners", () => {
  const aggregateId = 'id'
  const store = {
    add: jest.fn(),
    remove: jest.fn(),
    addLinkToBundle: jest.fn(),
    update: jest.fn()
  }
  const listeners = EventListeners(store)
  const onBundleCreatedListeners = listeners.BundleCreatedEvent
  const onBundleEditedListeners = listeners.BundleEditedEvent
  const onBundleDeletedListeners = listeners.BundleDeletedEvent
  const onLinkAddedToBundleListeners = listeners.LinkAddedToBundleEvent

  describe("BundleCreatedEvent listener", () => {
    it("Calls ::add on the bundle store", () => {
      const event = {
        aggregateId,
        payload: { name: 'foobar'}
      }
      onBundleCreatedListeners.forEach(fn => fn(event))
      expect(store.add).toBeCalledWith({name: 'foobar', links: [], id: aggregateId})
    })
  })

  describe("BundleEditedEvent listener", () => {
    it("Calls ::update on the bundle store", () => {
      const event = {
        aggregateId,
        payload: {name: 'barfoo'},
        state: { name: 'barfoo', links: [] }
      }
      onBundleEditedListeners.forEach(fn => fn(event))
      expect(store.update).toBeCalledWith(aggregateId, {name: 'barfoo'})
    })
  })

  describe("BundleDeletedEvent listener", () => {
    it("Calls ::delete on the bundle store", () => {
      const event = { aggregateId }
      onBundleDeletedListeners.forEach(fn => fn(event))
      expect(store.remove).toBeCalledWith(aggregateId)
    })
  })

  describe("LinkAddedToBundleEvent listener", () => {
    it("Calls ::addLinkToBundle on the bundle store", () => {
      const event = {
        aggregateId,
        payload: {
          title: 'title',
          url: 'url'
        }
      }

      onLinkAddedToBundleListeners.forEach(fn => fn(event))
      expect(store.addLinkToBundle).toBeCalledWith(aggregateId, event.payload)
    })
  })
})
