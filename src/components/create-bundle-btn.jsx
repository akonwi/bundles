export default function(cancelling, onClick) {
  return () => {
    return {
      render() {
        let text = cancelling ? 'Cancel' : 'New'
        return <a className='nav-btn' href='#' onClick={onClick}>{text}</a>
      }
    }
  }
}
