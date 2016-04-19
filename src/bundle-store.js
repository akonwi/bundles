import ChromeStorage from '../lib/chrome-storage'
import {create} from './bundle'

const storage = ChromeStorage('sync')
const BUNDLES  = 'bundles'

export function get() {
  return storage.get(BUNDLES).then(bundles =>bundles || {})
}

export function save(bundles) {
  return storage.set(BUNDLES, bundles)
}

export function add({id, name, links}) {
  storage.get(BUNDLES)
  .then((bundles={}) => {
    bundles[id] = {id, name, links}
    return bundles
  })
  .then(save)
  .catch(err => { console.error(err) })
}

export function addLinkToBundle(name, link) {
  storage.get(name)
  .then(bundle => {
    bundle.links.push(link)
    storage.set(name, bundle)
  })
  .catch(err => { console.error(err) })
}

export function updateBundle(name, bundle) {
  storage.set(name, bundle)
  .catch(err => { console.error(err) })
}

export function remove(id) {
  get().then(bundles => {
    delete bundles[id]
    return bundles
  })
  .then(save)
  .catch(err => { console.error(err) })
}
