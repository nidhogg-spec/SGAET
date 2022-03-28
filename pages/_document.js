import Document, { Html, Head, Main, NextScript } from 'next/document'

class MyDocument extends Document {
  static async getInitialProps(ctx) {
    const initialProps = await Document.getInitialProps(ctx)
    return { ...initialProps }
  }
  render() {
    return (
      <Html>
         <Head>
            
            <meta charSet="UTF-8"></meta>
            <meta name="author" content="AMARU SYSTEMS"></meta>
            <meta name="description" content="Sistema de Gestion de Administracion de Empresas Turisticas"></meta>
            <link rel="icon" href="/resources/mini_logo.png" />
            <link rel="stylesheet" href="https://fonts.googleapis.com/icon?family=Material+Icons" />
        </Head>
        <body>          
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