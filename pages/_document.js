import Document, { Html, Head, Main, NextScript } from 'next/document'
import Header from "../components/header/Header"
import NavLateral from "../components/navLateral/NavLateral"

class MyDocument extends Document {
  static async getInitialProps(ctx) {
    const initialProps = await Document.getInitialProps(ctx)
    return { ...initialProps }
  }
  render() {
    return (
      <Html>
         <Head>
            <link rel="icon" href="/favicon.ico" />
        </Head>
        <body>
          <Header/>
          <NavLateral/>
          <div className="MainContainer">
          <Main />
          <NextScript />
          </div>
        </body>
      </Html>
    )
  }
}

export default MyDocument