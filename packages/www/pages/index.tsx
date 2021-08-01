import { NextSeo } from "next-seo";
import LandingPage from "@open-fpl/www/features/LandingPage/LandingPage";
import { origin } from "@open-fpl/www/features/Navigation/internalUrls";
import getOgImage from "@open-fpl/www/features/OpenGraphImages/getOgImage";

const IndexPage = () => {
  return (
    <>
      <NextSeo
        title="Open FPL – Free open-source Fantasy Premier League tools"
        description="Level up your FPL game with Player Statistics Explorer, Team Planner, Fixture Difficulty Rating."
        canonical={origin}
        openGraph={{
          url: origin,
          title: "Open FPL – Free open-source Fantasy Premier League tools",
          description:
            "Level up your FPL game with Player Statistics Explorer, Team Planner, Fixture Difficulty Rating.",
          images: [
            {
              url: getOgImage("Open FPL.png?width=100,height=100"),
              width: 800,
              height: 600,
              alt: "Open FPL",
            },
          ],
          site_name: "Open FPL",
        }}
        twitter={{
          handle: "@openfpl",
          site: "@openfpl",
          cardType: "summary_large_image",
        }}
      />
      <LandingPage />
    </>
  );
};

export default IndexPage;
