export function CreateBundle({name}) {
  return {name: 'CreateBundle', message: {name} }
}

export function DeleteBundle({id}) {
  return {name: 'DeleteBundle', message: {id}}
}

export function AddLink(attrs) {
  return {name: 'AddLink', message: attrs}
}
