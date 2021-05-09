import Document, { Head, Html, Main, NextScript } from "next/document";
import { InitializeColorMode } from "theme-ui";

export default class extends Document {
  static async getInitialProps(ctx) {
    const initialProps = await Document.getInitialProps(ctx);
    return { ...initialProps };
  }

  render() {
    return (
      <Html lang="en">
        <Head>
          <link
            rel="preload"
            href="/fonts/inter-var-latin.woff2"
            as="font"
            type="font/woff2"
            crossOrigin="anonymous"
          />
          <style
            dangerouslySetInnerHTML={{
              __html: `
              @font-face {
                font-family: "Inter";
                font-style: normal;
                font-weight: 100 900;
                font-display: optional;
                src: url(/fonts/inter-var-latin.woff2) format("woff2");
                unicode-range: U+0000-00FF, U+0131, U+0152-0153, U+02BB-02BC,
                  U+02C6, U+02DA, U+02DC, U+2000-206F, U+2074, U+20AC, U+2122,
                  U+2191, U+2193, U+2212, U+2215, U+FEFF, U+FFFD;
              }
  
              html,
              body,
              #__next {
                margin: 0;
                padding: 0;
                height: 100%;
              }`,
            }}
          />
        </Head>
        <body>
          <InitializeColorMode />
          <Main />
          <NextScript />
        </body>
      </Html>
    );
  }
}
