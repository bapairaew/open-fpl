import { InferGetStaticPropsType } from "next";
import { NextSeo } from "next-seo";

export const getStaticProps = async () => {
  return {
    props: {
      date: new Date().toUTCString(),
    },
  };
};

const IndexPage = ({
  date,
}: InferGetStaticPropsType<typeof getStaticProps>) => {
  return (
    <>
      <NextSeo noindex title="Open FPL Data" />
      <style jsx>{`
        main {
          display: flex;
          justify-content: center;
          align-items: center;
          flex-direction: column;
          font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto;
          padding: 2vw;
          height: 96vh;
          width: 96vw;
        }
        h1 {
          opacity: 0.7;
          font-size: 4vw;
          margin: 0 0 40px 0;
        }
        p {
          font-weight: 900;
          font-size: 5vw;
          margin: 0;
        }
      `}</style>
      <main>
        <h1>Last update</h1>
        <p>{date}</p>
      </main>
    </>
  );
};

export default IndexPage;
