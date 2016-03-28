import ChromeStorage from '../lib/chrome-storage'
import {create} from './bundle'

export function addBundle({name, links}) {
  ChromeStorage.set(name, {name, links})
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
