import { NextSeo } from "next-seo";
import LandingPage from "~/features/LandingPage/LandingPage";
import { baseUrl } from "~/features/Navigation/internalUrls";

const IndexPage = () => {
  return (
    <>
      <NextSeo
        title="Open FPL – Free open-source Fantasy Premier League tools"
        description="Level up your FPL game with Player Statistics Explorer, Transfer Planner, Fixture Difficulty Rating."
        canonical={baseUrl}
        openGraph={{
          url: baseUrl,
          title: "Open FPL – Free open-source Fantasy Premier League tools",
          description:
            "Level up your FPL game with Player Statistics Explorer, Transfer Planner, Fixture Difficulty Rating.",
          images: [
            {
              url: `${baseUrl}/api/ogimages/Open FPL.png?width=800,height=600`,
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
