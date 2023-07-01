export { Link }

function Link({...props}) {
  // const className = [props.className, pageContext.urlPathname === props.href && 'is-active'].filter(Boolean).join(' ')
  return <a {...props}/>
}



