import { Spinner } from "@chakra-ui/react";
import { useIsLocalStorageSupported } from "@open-fpl/app/features/Common/useLocalStorage";
import getDataUrl from "@open-fpl/app/features/Data/getDataUrl";
import AppLayout from "@open-fpl/app/features/Layout/AppLayout";
import FullScreenMessageWithAppDrawer from "@open-fpl/app/features/Layout/FullScreenMessageWithAppDrawer";
import { origin } from "@open-fpl/app/features/Navigation/internalUrls";
import getOgImage from "@open-fpl/app/features/OpenGraphImages/getOgImage";
import Dashboard from "@open-fpl/app/features/Dashboard/Dashboard";
import UnhandledError from "@open-fpl/common/features/Error/UnhandledError";
import { TeamFixtures } from "@open-fpl/data/features/AppData/appDataTypes";
import { Player } from "@open-fpl/data/features/AppData/playerDataTypes";
import { Event, Team } from "@open-fpl/data/features/RemoteData/fplTypes";
import { InferGetStaticPropsType } from "next";
import { NextSeo } from "next-seo";
import useSWR from "swr";

export const getStaticProps = async () => {
  try {
    const [teamFixtures, fplTeams, fplGameweeks] = await Promise.all([
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

    const currentGameweek = fplGameweeks[0];

    return {
      props: {
        teamFixtures,
        fplTeams,
        currentGameweek,
      },
    };
  } catch (e) {
    return {
      props: {
        error: "Unexpected error while fetching data from FPL.",
      },
    };
  }
};

function PlayersExplorerPage({
  teamFixtures,
  fplTeams,
  currentGameweek,
}: InferGetStaticPropsType<typeof getStaticProps>) {
  const { data: players, error: playersError } = useSWR<Player[]>(
    getDataUrl("/app-data/players.json")
  );

  const isLocalStorageSupported = useIsLocalStorageSupported();

  const isReady = [players, teamFixtures, fplTeams, currentGameweek].every(
    (x) => x !== undefined
  );

  const errors = [playersError ? "Players" : null].filter((x) => x) as string[];

  let mainContent = null;

  if (isLocalStorageSupported) {
    if (isReady) {
      mainContent = <Dashboard currentGameweek={currentGameweek!} />;
    } else if (errors.length > 0) {
      mainContent = (
        <UnhandledError
          Wrapper={FullScreenMessageWithAppDrawer}
          as="main"
          additionalInfo={`Failed to load ${errors.join(", ")}`}
        />
      );
    } else {
      mainContent = (
        <FullScreenMessageWithAppDrawer
          as="main"
          symbol={<Spinner size="xl" />}
          heading="One moment..."
          text="Please wait while we are preparing players data."
        />
      );
    }
  }

  return (
    <>
      <NextSeo
        title="Dashboard - Open FPL"
        description="Level up your FPL game with Player Statistics Explorer, Team Planner, Fixture Difficulty Rating."
        canonical={`${origin}/`}
        openGraph={{
          url: `${origin}/`,
          title: "Open FPL",
          description:
            "Level up your FPL game with Player Statistics Explorer, Team Planner, Fixture Difficulty Rating.",
          images: [
            {
              url: getOgImage(
                "Open FPL.png?width=100,height=100,fontSize=154px"
              ),
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
      <AppLayout>{mainContent}</AppLayout>
    </>
  );
}

export default PlayersExplorerPage;
