import {create, SYNC} from '../lib/chrome-storage'

const storage = create(SYNC)
const BUNDLES  = 'bundles'

const save = (bundles) => storage.set(BUNDLES, bundles)

export function get() {
  return storage.get(BUNDLES).then(bundles => bundles || [])
}

export function add({id, name, links}) {
  return storage.get(BUNDLES)
  .then(bundles => bundles.concat([{id, name, links}]))
  .then(save)
}

export function update(id, name) {
  return storage.get(BUNDLES)
  .then(bundles => (
    bundles.map(bundle => (
      bundle.id === id ? Object.assign({}, bundle, {name}) : bundle
    ))
  ))
  .then(save)
}

export function addLinkToBundle(id, link) {
  return get()
  .then(bundles => (
    bundles.map(bundle => (
      bundle.id === id ? Object.assign({}, bundle, {links: bundle.links.concat(link)}): bundle
    ))
  ))
  .then(save)
}

export function remove(id) {
  return get()
  .then(bundles => bundles.filter(bundle => bundle.id !== id))
  .then(save)
}
