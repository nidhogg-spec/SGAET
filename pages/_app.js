import '../styles/globals.css'
import '../styles/global_var.css'
import Header from "../components/ComponentesReutilizables/header/Header"
import NavLateral from "../components/ComponentesReutilizables/navLateral/NavLateral"
import Router from "next/router";
import { useState } from 'react'
import Head from 'next/head'
import { AppWrapper } from '@/components/Contexto'
import AppLoader from '@/components/Loading/Loading'
import PublicHeader from "../components/ComponentesReutilizables/PublicHeader/PublicHeader"

//this import is using the next.config,js how we see we aren't specification the exact path



function MyApp({ Component, pageProps }) {
  const [AppLoading, setAppLoading] = useState(false);
  Router.events.on('routeChangeStart', () => {
    setAppLoading(true)
  });
  Router.events.on('routeChangeComplete', () => setAppLoading(false));
  return (
    /*Here is where the indexjs is rendering is something like the index in react you can also
    add the footer under the component and will work like the footer don't delete the <> </> cause throws and error
    */
    <>
      <Head>
        <title>Sistema SGAET</title>
      </Head>
      {
        pageProps.publicPage ?
          <div className="PublicMainContainer">
            <PublicHeader />
            <Component {...pageProps} />
          </ div> :
          <div className="MainContainer">
            <AppWrapper>
              <AppLoader
                Loading={AppLoading}
                key={'AppLoader001'}
              />
              <Header />
              <NavLateral />
              <Component {...pageProps} />
            </AppWrapper>
          </div>
      }
    </>
  )
}
// MyApp.getInitialProps = async ({req, res}) => {
//   const {Auth} = withSSRContext({req})

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
