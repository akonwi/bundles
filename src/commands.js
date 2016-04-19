export function CreateBundle({name}) {
  return {name: 'CreateBundle', message: {name} }
}

export function DeleteBundle({id}) {
  return {name: 'DeleteBundle', message: {id}}
}

export function AddLink({id, title, url}) {
  return {name: 'AddLink', message: {id, title, url}}
}
