import FullScreenMessage from "@open-fpl/common/features/Layout/FullScreenMessage";
import { InferGetStaticPropsType } from "next";
import { NextSeo } from "next-seo";

export const getStaticProps = async () => {
  return {
    props: { lastUpdated: new Date().toJSON() },
  };
};

const IndexPage = ({
  lastUpdated,
}: InferGetStaticPropsType<typeof getStaticProps>) => {
  return (
    <>
      <NextSeo noindex title="Open FPL Data" />
      <FullScreenMessage
        symbol="ᕕ( ᐛ )ᕗ"
        heading={lastUpdated}
        text="Last updated"
        as="main"
      />
    </>
  );
};

export default IndexPage;
