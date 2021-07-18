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
      <div>Last update: {date}</div>
    </>
  );
};

export default IndexPage;
