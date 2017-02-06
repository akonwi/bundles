import {create, SYNC} from '../lib/chrome-storage'

const storage = create(SYNC)
const BUNDLES  = 'bundles'

const save = (bundles) => storage.set(BUNDLES, bundles)

export function get() {
  return storage.get(BUNDLES).then(bundles => bundles || [])
}

export function add({id, name, links}) {
  get()
  .then(bundles => {
    bundles.push({id, name, links})
    return bundles
  })
  .then(save)
  .catch(console.error)
}

export function update(id, {name}) {
  get()
  .then(bundles => {
    return bundles.map(bundle => {
      if (bundle.id === id)
        return Object.assign({}, bundle, {name})
      else
        return bundle
    })
  })
  .then(save)
  .catch(console.error)
}

export function addLinkToBundle(id, link) {
  get()
  .then(bundles => {
    return bundles.map(bundle => {
      if (bundle.id === id)
        return Object.assign({}, bundle, {links: bundle.links.concat(link)})
      else
        return bundle
    })
  })
  .then(save)
  .catch(console.error)
}

export function remove(id) {
  get().then(bundles => {
    return bundles.filter(bundle => bundle.id !== id)
  })
  .then(save)
  .catch(console.error)
}

export function onChange(fn) {
  storage.onChange(changes => {
    Object.keys(changes).some(key => {
      if (key === 'bundles') {
        get().then(fn)
      }
    })
  })
}
