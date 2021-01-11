import '../styles/globals.css'
import Header from "../components/header/Header"
import NavLateral from "../components/navLateral/NavLateral"
import {useEffect} from 'react'
import {Amplify,Auth} from 'aws-amplify'
import Router from "next/router";
import config from 'src/aws-exports'

//this import is using the next.config,js how we see we aren't specification the exact path

Amplify.configure({...config,ssr: true})

function MyApp({ Component, pageProps }) {
    
  // const { data, revalidate } = useSWR("/api/me", async function (args) {
  //   const res = await fetch(args);
  //   return res.json();
  // });
  //tener en cuenta quer los estado que se manejen en esta pagina seran persistente para
  //las vinculadas posteriorment
  return (
    /*Here is where the indexjs is rendering is something like the index in react you can also
    add the footer under the component and will work like the footer don't delete the <> </> cause throws and error
    */
    <>     
      <Header/>
      <NavLateral/>
      {/* {data!=undefined && (
        data.email && (
          
        )
      )} */}
      <Component {...pageProps} />
    </>
  )
}

export default MyApp
