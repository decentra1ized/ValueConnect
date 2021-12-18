import '../styles/globals.css'
import '../styles/index.css'
import '../styles/profile.css'
import '../styles/leftside.css'
import '../styles/tokenlist.css'

function MyApp({ Component, pageProps }) {
  return <div className="root">
  <meta charSet="UTF-8" />
  <meta httpEquiv="X-UA-Compatible" content="IE=edge" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.1.2/dist/css/bootstrap.min.css" rel="stylesheet" />
  <Component {...pageProps} />
  </div>
}

export default MyApp
