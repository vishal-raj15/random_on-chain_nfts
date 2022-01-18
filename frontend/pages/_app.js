import '../styles/globals.css'
import Link from 'next/link'

function MyApp({ Component, pageProps }) {
  return (
    <div>
      
      <Component {...pageProps} />
    </div>
  )
}

export default MyApp