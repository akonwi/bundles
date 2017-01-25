import CommandHandlers from '../src/command-handlers'

describe("Command Handlers", () => {
  const title = 'title'
  const url = 'url'
  const createdEvent = {name: 'bundleCreatedEvent'}
  const editedEvent = {name: 'bundleEditedEvent'}
  const deletedEvent = {name: 'bundleDeletedEvent'}
  const linkAddedEvent = {name: 'linkAddedEvent'}
  const bundle = {
    addLink: () => linkAddedEvent,
    edit: () => editedEvent
  }
  const repository = {
    add({name}) {
      if (name === 'foobar') return Promise.resolve(createdEvent)
    },
    delete(id) {
      if (id === 'foobar') return Promise.resolve(deletedEvent)
    },
    load(id) {
      if (id === 'foobar') return Promise.resolve(bundle)
    }
  }
  const {CreateBundle, EditBundle, DeleteBundle, AddLink} = CommandHandlers(repository)

  describe("CreateBundle command handler", () => {
    it("Calls ::add on the repository", () => {
      CreateBundle({name: 'foobar'}).then(event => expect(event).toBe(createdEvent))
    })
  })

  describe("EditBundle command handler", () => {
    it("Calls ::edit on the bundle", () => {
      return EditBundle({id: 'foobar', name: 'barfoo'}).then(event => expect(event).toBe(editedEvent))
    })
  })

  describe("DeleteBundle command handler", () => {
    it("Calls ::delete on the repository", () => {
      DeleteBundle({id: 'foobar'}).then(event => expect(event).toBe(deletedEvent))
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
