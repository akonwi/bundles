import {create, SYNC} from '../lib/chrome-storage'

const storage = create(SYNC)
const EVENTS  = 'events'

const save = events => storage.set(EVENTS, events)

export function add(event) {
  getEvents()
  .then(events => {
    events.push(event)
    return events
  })
  .then(save)
}

export function getEvents() {
  return storage.get(EVENTS).then(events => events || [])
}
