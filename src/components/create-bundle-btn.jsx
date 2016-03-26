export default function({isCreating, onClick}) {
  const text = isCreating ? 'Cancel' : 'New'
  return <a className='nav-btn' href='#' onClick={onClick}>{text}</a>
}
