export default function(creating, onClick) {
  const text = creating ? 'Cancel' : 'New'

  const view = {
    render() {
      return <a className='nav-btn' href='#' onClick={onClick}>{text}</a>
    }
  }

  return () => {  return view }
}
