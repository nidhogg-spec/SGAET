import '../styles/globals.css'

//this import is using the next.config,js how we see we aren't specification the exact path

function MyApp({ Component, pageProps }) {
  return (
    /*Here is where the indexjs is rendering is something like the index in react you can also
    add the footer under the component and will work like the footer don't delete the <> </> cause throws and error
    */
   
    <>
      <Component {...pageProps} />
    </>
  )
}

export default MyApp
