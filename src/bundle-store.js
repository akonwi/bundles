import * as Bundle from './bundle'

let subscribers = []
let bundles = undefined

export function init(data) {
  bundles = data
  ChromeStorage.onChange((changes) => {
    ChromeStorage.all().then((data) => {
      bundles = data
      subscribers.forEach(s => {
        s.setState({ bundles })
      })
    })
  })
}

// Returns mixin for component use
export function Subscriber() {
  return {
    getInitialState() {
      return { bundles }
    },
    componentDidMount() {
      subscribers.push(this)
    }
  }
}

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
