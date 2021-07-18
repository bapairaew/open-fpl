import lastUpdated from "@open-fpl/data/last-updated.json";
import { NextSeo } from "next-seo";

const IndexPage = () => {
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
        <h1>Last updated</h1>
        <p>{lastUpdated.date}</p>
      </main>
    </>
  );
};

export default IndexPage;
