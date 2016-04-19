import ChromeStorage from '../lib/chrome-storage'

const storage = ChromeStorage('sync')
const EVENTS  = 'events'

const save = (events) => storage.set(EVENTS, events)

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
