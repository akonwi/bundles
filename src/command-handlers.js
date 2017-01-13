import {Event} from 'qubits'
import {CreateBundle, DeleteBundle, AddLink} from './commands'

export default function(repository) {
  return {
    [CreateBundle.name]: ({name}) => {
      return repository.add({name})
    },
    [DeleteBundle.name]: ({id}) => {
      return repository.delete(id)
    },
    [AddLink.name]: ({id, title, url}) => {
      return repository.load(id).then(bundle => bundle.addLink({title, url}))
    }
  }
}
