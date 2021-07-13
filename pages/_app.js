import '../styles/globals.css'
import Header from "../components/header/Header"
import NavLateral from "../components/navLateral/NavLateral"
import {Amplify } from 'aws-amplify'
import config from 'src/aws-exports'
import Router from "next/router";
import { useState } from 'react'
import {AppWrapper} from '@/components/Contexto'
import AppLoader from '@/components/Loading/Loading'

//this import is using the next.config,js how we see we aren't specification the exact path

Amplify.configure({...config,ssr: true})


function MyApp({ Component, pageProps }) {
  const [AppLoading, setAppLoading] = useState(false);
  Router.events.on('routeChangeStart', () => {
    setAppLoading(true)
  });
  Router.events.on('routeChangeComplete', () => setAppLoading(false));
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
      <AppWrapper>
        <AppLoader
          Loading={AppLoading}
          key={'AppLoader001'}
        />
        <Header />
        <NavLateral/>
        <Component {...pageProps} />
      </AppWrapper>
    </>
  )
}
// MyApp.getInitialProps = async ({req,res}) => {
//   const { Auth } = withSSRContext({req})

//   console.log(await Auth.currentAuthenticatedUser())
//   // try{
//   //   await Auth.currentAuthenticatedUser()

//   // }catch{

//   // }
  
//   // const appProps = await App.getInitialProps(ctx);
//   // if(ctx.req){
//   //   console.log("acaes")
//   // }
//   // if(appProps.req){
//   //   console.log("aca es")
//   // }
//   // // calls page's `getInitialProps` and fills `appProps.pageProps`
//   // console.log(Auth.currentAuthenticatedUser())
//   // console.log(ctx)
//   // console.log(appProps)
//   // 000
// }

export default MyApp
