import ChromeStorage from '../lib/chrome-storage'
import navbar from './components/navbar.jsx'
import BundleList from './components/bundle-list.jsx'

(() => {
  let Core = {
    actions: {},
    on(event, fn, ctx=this) {
      let todos = this.actions[event]
      let todo = {fn, ctx}
      if (!!todos)
        todos.push(todo)
      else
        this.actions[event] = [todo]
    },
    trigger(event, data) {
      var todos = this.actions[event]
      if (!!todos)
        todos.forEach(({fn, ctx}) => {
          fn.call(ctx, data)
        })
    }
  }

  let Navbar = navbar(Core)
  React.render(<Navbar/>, document.querySelector('.navbar'))
  
  ChromeStorage.all().then((data) => {
    React.render(<BundleList bundles={data}/>, document.querySelector('.content'))
  }).catch(error => { console.error("Couldn't start the app due to: " + error) })
})()
