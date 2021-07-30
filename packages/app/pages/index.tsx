import { Spinner } from "@chakra-ui/react";
import { useIsLocalStorageSupported } from "@open-fpl/app/features/Common/useLocalStorage";
import getDataUrl from "@open-fpl/app/features/Data/getDataUrl";
import AppLayout from "@open-fpl/app/features/Layout/AppLayout";
import FullScreenMessageWithAppDrawer from "@open-fpl/app/features/Layout/FullScreenMessageWithAppDrawer";
import { origin } from "@open-fpl/app/features/Navigation/internalUrls";
import getOgImage from "@open-fpl/app/features/OpenGraphImages/getOgImage";
import PlayersExplorer from "@open-fpl/app/features/PlayersExplorer/PlayersExplorer";
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

    const currentGameweek = fplGameweeks[0]?.id ?? 38; // Remaining gameweeks is empty when the last gameweek finished

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
      mainContent = (
        <PlayersExplorer
          as="main"
          players={players!}
          teamFixtures={teamFixtures!}
          fplTeams={fplTeams!}
          currentGameweek={currentGameweek!}
        />
      );
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
        title="Player Statistics Explorer – Open FPL"
        description="Explore Fantasy Premier League player statistics xG, xGA, and more to make a better decision on your team."
        canonical={`${origin}/`}
        openGraph={{
          url: `${origin}/`,
          title: "Player Statistics Explorer – Open FPL",
          description:
            "Explore Fantasy Premier League player statistics xG, xGA, and more to make a better decision on your team.",
          images: [
            {
              url: getOgImage(
                "Player Statistics Explorer.png?width=100,height=100,fontSize=154px"
              ),
              width: 800,
              height: 600,
              alt: "Player Statistics Explorer – Open FPL",
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
