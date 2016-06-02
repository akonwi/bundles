import {create, SYNC} from '../lib/chrome-storage'

const storage = create(SYNC)
const BUNDLES  = 'bundles'

const save = (bundles) => storage.set(BUNDLES, bundles)

export function get() {
  return storage.get(BUNDLES).then(bundles =>bundles || {})
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

export function addLinkToBundle(id, link) {
  get()
  .then(bundles => {
    let bundle = bundles[id]
    bundle.links.push(link)
    save(bundles)
  })
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
