const Bundle = {
  name: undefined,
  links: [],
  open: false
}

function extend(target, ...sources) {
  let obj = {}
  sources = [target, ...sources]
  sources.forEach(source => {
    Object.keys(source).forEach(key => obj[key] = source[key])
  })
  return obj
}

export function create(attrs) {
  if (attrs.name === undefined)
    throw new Error("Cannot create a bundle without a name.")
  return extend(Bundle, attrs)
}
