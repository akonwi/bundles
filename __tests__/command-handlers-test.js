import CommandHandlers from '../src/command-handlers'

describe("Command Handlers", () => {
  const title = 'title'
  const url = 'url'
  const createdEvent = {name: 'bundleCreatedEvent'}
  const deletedEvent = {name: 'bundleDeletedEvent'}
  const linkAddedEvent = {name: 'linkAddedEvent'}
  const bundle = {
    addLink: () => linkAddedEvent
  }
  const repository = {
    add({name}) {
      if (name === 'foobar') return createdEvent
    },
    delete(id) {
      if (id === 'foobar') return deletedEvent
    },
    load(id) {
      if (id === 'foobar') return Promise.resolve(bundle)
    }
  }
  const {CreateBundle, DeleteBundle, AddLink} = CommandHandlers(repository)

  describe("CreateBundle command handler", () => {
    it("Calls ::add on the repository", () => {
      expect(CreateBundle({name: 'foobar'})).toBe(createdEvent)
    })
  })

  describe("DeleteBundle command handler", () => {
    it("Calls ::delete on the repository", () => {
      expect(DeleteBundle({id: 'foobar'})).toBe(deletedEvent)
    })
  })

  describe("AddLink command handler", () => {
    it("Calls ::addLink on the bundle", () => {
      AddLink({id: 'foobar', title, url}).then(event => {
        expect(event).toBe(linkAddedEvent)
      })
    })
  })
})
