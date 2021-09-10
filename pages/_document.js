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