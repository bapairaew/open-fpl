import { NextSeo } from "next-seo";
import LandingPage from "~/features/LandingPage/LandingPage";

const IndexPage = () => {
  return (
    <>
      <NextSeo
        title="Free open-source Fantasy Premier League tools – Open FPL"
        description="Level up your FPL game with Player Statistics Explorer, Transfer Planner, Fixture Difficulty Rating."
      />
      <LandingPage />
    </>
  );
};

export default IndexPage;
