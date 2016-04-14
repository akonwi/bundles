import ChromeStorage from '../lib/chrome-storage'
import {create} from './bundle'

const BUNDLES  = 'bundles'

export function get() {
  return ChromeStorage.get(BUNDLES).then(bundles => bundles || {})
}

export function addBundle({name, links}) {
  ChromeStorage.get(BUNDLES)
  .then((bundles={}) => {
    bundles[name] = {name, links}
    return bundles
  })
  .then(bundles => {
    ChromeStorage.set(BUNDLES, bundles)
  })
  .catch(err => { console.error(err) })
}

export function addLinkToBundle(name, link) {
  ChromeStorage.get(name)
  .then(bundle => {
    bundle.links.push(link)
    ChromeStorage.set(name, bundle)
  })
  .catch(err => { console.error(err) })
}

export function updateBundle(name, bundle) {
  ChromeStorage.set(name, bundle)
  .catch(err => { console.error(err) })
}

export function removeBundle(name) {
  ChromeStorage.remove(name)
  .catch(err => { console.error(err) })
}
