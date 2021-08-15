import { Spinner } from "@chakra-ui/react";
import { getFixtures } from "@open-fpl/app/features/Api/fixture";
import { useIsLocalStorageSupported } from "@open-fpl/app/features/Common/useLocalStorage";
import Dashboard from "@open-fpl/app/features/Dashboard/Dashboard";
import getDataUrl from "@open-fpl/app/features/Data/getDataUrl";
import AppLayout from "@open-fpl/app/features/Layout/AppLayout";
import FullScreenMessageWithAppDrawer from "@open-fpl/app/features/Layout/FullScreenMessageWithAppDrawer";
import { origin } from "@open-fpl/app/features/Navigation/internalUrls";
import getOgImage from "@open-fpl/app/features/OpenGraphImages/getOgImage";
import UnhandledError from "@open-fpl/common/features/Error/UnhandledError";
import { Player } from "@open-fpl/data/features/AppData/playerDataTypes";
import { Team } from "@open-fpl/data/features/AppData/teamDataTypes";
import { Event } from "@open-fpl/data/features/RemoteData/fplTypes";
import { InferGetStaticPropsType } from "next";
import { NextSeo } from "next-seo";
import { useRouter } from "next/dist/client/router";
import { useEffect } from "react";
import useSWR from "swr";

export const getStaticProps = async () => {
  const [teams, fplGameweeks] = await Promise.all([
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

  const [currentFixtures, nextFixtures] = await Promise.all([
    currentGameweek && getFixtures(currentGameweek.id),
    getFixtures(nextGameweek.id),
  ]);

  return {
    props: {
      teams,
      currentGameweek,
      currentFixtures,
      nextGameweek,
      nextFixtures,
      now: new Date().toJSON(),
    },
    revalidate: 60,
  };
};

function DashboardPage({
  teams,
  currentGameweek,
  currentFixtures,
  nextGameweek,
  nextFixtures,
  now,
}: InferGetStaticPropsType<typeof getStaticProps>) {
  const router = useRouter();
  const { data: players, error: playersError } = useSWR<Player[]>(
    getDataUrl("/app-data/players.json")
  );

  useEffect(() => {
    const interval = setInterval(() => {
      router.replace(router.asPath);
    }, 30 * 1000);
    return () => clearInterval(interval);
  }, []);

  const isLocalStorageSupported = useIsLocalStorageSupported();

  const isReady = [
    players,
    teams,
    currentGameweek,
    currentFixtures,
    nextGameweek,
    nextFixtures,
  ].every((x) => x !== undefined);

  const errors = [playersError ? "Players" : null].filter((x) => x) as string[];

  let mainContent = null;

  // if (isLocalStorageSupported) {
  //   if (isReady) {
  //     mainContent = (
  //       <Dashboard
  //         as="main"
  //         players={players!}
  //         teams={teams!}
  //         currentGameweek={currentGameweek as Event | null}
  //         currentFixtures={currentFixtures!}
  //         nextGameweek={nextGameweek!}
  //         nextFixtures={nextFixtures!}
  //       />
  //     );
  //   } else if (errors.length > 0) {
  //     mainContent = (
  //       <UnhandledError
  //         Wrapper={FullScreenMessageWithAppDrawer}
  //         as="main"
  //         additionalInfo={`Failed to load ${errors.join(", ")}`}
  //       />
  //     );
  //   } else {
  //     mainContent = (
  //       <FullScreenMessageWithAppDrawer
  //         as="main"
  //         symbol={<Spinner size="xl" />}
  //         heading="One moment..."
  //         text="Please wait while we are preparing your dashboard data."
  //       />
  //     );
  //   }
  // }

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
      <AppLayout>{now}</AppLayout>
    </>
  );
}

export default DashboardPage;
