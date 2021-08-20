import { Spinner } from "@chakra-ui/react";
import { useIsLocalStorageSupported } from "@open-fpl/app/features/Common/useLocalStorage";
import Dashboard from "@open-fpl/app/features/Dashboard/Dashboard";
import {
  getServerDashboardFixture,
  getServerPlayersStats,
} from "@open-fpl/app/features/Dashboard/dashboardFixtures";
import getDataUrl from "@open-fpl/app/features/Data/getDataUrl";
import AppLayout from "@open-fpl/app/features/Layout/AppLayout";
import FullScreenMessageWithAppDrawer from "@open-fpl/app/features/Layout/FullScreenMessageWithAppDrawer";
import { origin } from "@open-fpl/app/features/Navigation/internalUrls";
import getOgImage from "@open-fpl/app/features/OpenGraphImages/getOgImage";
import UnhandledError from "@open-fpl/common/features/Error/UnhandledError";
import { TeamFixtures } from "@open-fpl/data/features/AppData/fixtureDataTypes";
import { Player } from "@open-fpl/data/features/AppData/playerDataTypes";
import { Team } from "@open-fpl/data/features/AppData/teamDataTypes";
import {
  getFixtures,
  getLiveEvent,
} from "@open-fpl/data/features/RemoteData/fpl";
import { Event } from "@open-fpl/data/features/RemoteData/fplTypes";
import { InferGetStaticPropsType } from "next";
import { NextSeo } from "next-seo";
import Router from "next/router";
import useSWR from "swr";

export const getStaticProps = async () => {
  const [players, teamFixtures, teams, fplGameweeks] = await Promise.all([
    fetch(getDataUrl("/app-data/players.json")).then((r) =>
      r.json()
    ) as Promise<Player[]>,
    fetch(getDataUrl("/app-data/fixtures.json")).then((r) =>
      r.json()
    ) as Promise<TeamFixtures[]>,
    fetch(getDataUrl("/app-data/teams.json")).then((r) => r.json()) as Promise<
      Team[]
    >,
    fetch(getDataUrl("/remote-data/fpl_gameweeks/data.json")).then((r) =>
      r.json()
    ) as Promise<Event[]>,
  ]);

  const currentGameweek = fplGameweeks.find((g) => g.is_current) ?? null;

  const nextGameweek =
    fplGameweeks.find((g) => g.is_next) ??
    fplGameweeks[fplGameweeks.length - 1];

  const [_currentFixtures, liveEvent, _nextFixtures] = await Promise.all([
    currentGameweek && getFixtures(currentGameweek.id),
    currentGameweek && getLiveEvent(currentGameweek.id),
    getFixtures(nextGameweek.id),
  ]);

  const currentGameweekFixtures = _currentFixtures?.map((fixture) => {
    return getServerDashboardFixture(
      fixture,
      (liveEvent && getServerPlayersStats(liveEvent, fixture, players)) ?? null
    );
  });

  const nextGameweekFixtures = _nextFixtures.map((fixture) =>
    getServerDashboardFixture(fixture)
  );

  return {
    props: {
      teams,
      teamFixtures,
      currentGameweek,
      nextGameweek,
      currentGameweekFixtures,
      nextGameweekFixtures,
    },
    revalidate: 60,
  };
};

type PageProps = InferGetStaticPropsType<typeof getStaticProps>;
type SWRPageProps = { pageProps: PageProps };

function DashboardPage(initialPageProps: PageProps) {
  const { data: players, error: playersError } = useSWR<Player[]>(
    getDataUrl("/app-data/players.json")
  );

  const dataUrl = Router.router?.pageLoader.getDataHref("/", "/", true);

  const { data: pageProps } = useSWR<SWRPageProps>(dataUrl, {
    refreshInterval: 30 * 1000,
    initialData: {
      pageProps: initialPageProps,
    },
  });

  const {
    pageProps: {
      teams,
      teamFixtures,
      currentGameweek,
      nextGameweek,
      currentGameweekFixtures,
      nextGameweekFixtures,
    },
  } = pageProps ?? { pageProps: {} };

  const isLocalStorageSupported = useIsLocalStorageSupported();

  const isReady = [
    players,
    teams,
    teamFixtures,
    currentGameweek,
    nextGameweek,
    currentGameweekFixtures,
    nextGameweekFixtures,
  ].every((x) => x !== undefined);

  const errors = [playersError ? "Players" : null].filter((x) => x) as string[];

  let mainContent = null;

  if (isLocalStorageSupported) {
    if (isReady) {
      mainContent = (
        <Dashboard
          as="main"
          players={players!}
          teams={teams!}
          teamFixtures={teamFixtures!}
          currentGameweekFixtures={currentGameweekFixtures ?? null}
          currentGameweek={currentGameweek ?? null}
          nextGameweek={nextGameweek!}
          nextGameweekFixtures={nextGameweekFixtures!}
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
          text="Please wait while we are preparing your dashboard data."
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

export default DashboardPage;
