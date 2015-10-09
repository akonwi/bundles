export default function(creating, onClick) {
  return () => {
    return {
      render() {
        let text = creating ? 'Cancel' : 'New'
        return <a className='nav-btn' href='#' onClick={onClick}>{text}</a>
      }
    }
  }
}
