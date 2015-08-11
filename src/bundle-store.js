import {create} from './bundle'

export function addBundle(name) {
  ChromeStorage.set(name, create({name}))
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
