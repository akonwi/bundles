import * as Bundle from './bundle'

export function addBundle(name) {
  let b = Bundle.create({name})
  ChromeStorage.set(name, b)
  .catch((err) => { console.error(err) })
}

export function addLinkToBundle(name, link) {
  ChromeStorage.get(name)
  .then(bundle => {
    bundle.links.push(link)
    return ChromeStorage.set(name, bundle)
  })
  .catch((err) => { console.error(err) })
}

export function updateBundle(name, bundle) {
  ChromeStorage.set(name, bundle)
  .catch(err => { console.error(err) })
}

export function removeBundle(name) {
  ChromeStorage.remove(name)
  .catch((err) => { console.error(err) })
}
