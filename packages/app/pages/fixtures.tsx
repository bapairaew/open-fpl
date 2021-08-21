import getDataUrl from "@open-fpl/app/features/Data/getDataUrl";
import Fixtures from "@open-fpl/app/features/Fixtures/Fixtures";
import AppLayout from "@open-fpl/app/features/Layout/AppLayout";
import { origin } from "@open-fpl/app/features/Navigation/internalUrls";
import getOgImage from "@open-fpl/app/features/OpenGraphImages/getOgImage";
import { TeamFixtures } from "@open-fpl/data/features/AppData/fixtureDataTypes";
import { Team } from "@open-fpl/data/features/AppData/teamDataTypes";
import { Event } from "@open-fpl/data/features/RemoteData/fplTypes";
import { InferGetStaticPropsType } from "next";
import { NextSeo } from "next-seo";

export const getStaticProps = async () => {
  const [teamFixtures, teams, fplGameweeks] = await Promise.all([
    fetch(getDataUrl("/app-data/fixtures.json")).then((r) =>
      r.json()
    ) as Promise<TeamFixtures[]>,
    fetch(getDataUrl("/remote-data/fpl_teams/data.json")).then((r) =>
      r.json()
    ) as Promise<Team[]>,
    fetch(getDataUrl("/remote-data/fpl_gameweeks/data.json")).then((r) =>
      r.json()
    ) as Promise<Event[]>,
  ]);

  const nextGameweekId: number = fplGameweeks.find((g) => g.is_next)?.id ?? 38; // Show gameweek 38 at the end of the season

  return {
    props: { teamFixtures, teams, nextGameweekId },
    revalidate: 60,
  };
};

function FixturesPage({
  teamFixtures,
  teams,
  nextGameweekId,
}: InferGetStaticPropsType<typeof getStaticProps>) {
  return (
    <>
      <NextSeo
        title="Fixture Difficulty Rating – Open FPL"
        description="Explore Fantasy Premier League fixtures and their Attack and Defence Fixture Difficulty Rating."
        canonical={`${origin}/fixtures`}
        openGraph={{
          url: `${origin}/fixtures`,
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
        <Fixtures
          as="main"
          teamFixtures={teamFixtures}
          teams={teams}
          nextGameweekId={nextGameweekId}
        />
      </AppLayout>
    </>
  );
}

export default FixturesPage;
