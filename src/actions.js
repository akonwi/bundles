export function addBundle(bundle) {
  return {type: 'ADD_BUNDLE', bundle}
}

export function renameBundle({id, name}) {
  return {type: 'RENAME_BUNDLE', id, name}
}

export function deleteBundle(id) {
  return {type: 'DELETE_BUNDLE', id}
}

export function addLink(id, link) {
  return {type: 'ADD_LINK_TO_BUNDLE', id, link}
}

export function toggleEditing(id, name) {
  return {
    type: 'TOGGLE_EDITING',
    bundle: {id, name}
  }
}
