import { InferGetStaticPropsType } from "next";
import { NextSeo } from "next-seo";
import getDataUrl from "~/features/Data/getDataUrl";
import Fixtures from "~/features/Fixtures/Fixtures";
import AppLayout from "~/features/Layout/AppLayout";
import { baseUrl } from "~/features/Navigation/internalUrls";
import getOgImage from "~/features/OpenGraphImages/getOgImage";
import { TeamFixtures } from "@open-fpl/data/features/AppData/appDataTypes";
import { Team } from "@open-fpl/data/features/RemoteData/fplTypes";

export const getStaticProps = async () => {
  const [teamFixtures, fplTeams] = await Promise.all([
    fetch(getDataUrl("/app-data/fixtures.json")).then((r) =>
      r.json()
    ) as Promise<TeamFixtures[]>,
    fetch(getDataUrl("/remote-data/fpl_teams/data.json")).then((r) =>
      r.json()
    ) as Promise<Team[]>,
  ]);

  return {
    props: { teamFixtures, fplTeams },
  };
};

function FixturesPage({
  teamFixtures,
  fplTeams,
}: InferGetStaticPropsType<typeof getStaticProps>) {
  return (
    <>
      <NextSeo
        title="Fixture Difficulty Rating – Open FPL"
        description="Explore Fantasy Premier League fixtures and their Attack and Defence Fixture Difficulty Rating."
        canonical={`${baseUrl}/fixtures`}
        openGraph={{
          url: `${baseUrl}/fixtures`,
          title: "Fixture Difficulty Rating – Open FPL",
          description:
            "Explore Fantasy Premier League fixtures and their Attack and Defence Fixture Difficulty Rating.",
          images: [
            {
              url: getOgImage(
                "Fixture Difficulty Rating.png?width=100,height=100,fontSize=154px"
              ),
              width: 800,
              height: 600,
              alt: "Fixture Difficulty Rating – Open FPL",
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
      <AppLayout>
        <Fixtures teamFixtures={teamFixtures} fplTeams={fplTeams} />
      </AppLayout>
    </>
  );
}

export default FixturesPage;
