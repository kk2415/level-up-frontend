import React from 'react'
import Header from './Header'
import Footer from './Footer'

const Layout = ( {children} ) => {
  return (
	<>
		<Header name="klyunkim"/>
			{children}
		<Footer />
	</>
  )
}

export default Layout