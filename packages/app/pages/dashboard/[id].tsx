import { Spinner } from "@chakra-ui/react";
import { useIsLocalStorageSupported } from "@open-fpl/app/features/Common/useLocalStorage";
import Dashboard from "@open-fpl/app/features/Dashboard/Dashboard";
import getDataUrl from "@open-fpl/app/features/Data/getDataUrl";
import AppLayout from "@open-fpl/app/features/Layout/AppLayout";
import FullScreenMessageWithAppDrawer from "@open-fpl/app/features/Layout/FullScreenMessageWithAppDrawer";
import { origin } from "@open-fpl/app/features/Navigation/internalUrls";
import getOgImage from "@open-fpl/app/features/OpenGraphImages/getOgImage";
import UnhandledError from "@open-fpl/common/features/Error/UnhandledError";
import { Player } from "@open-fpl/data/features/AppData/playerDataTypes";
import {
  getEntry,
  getEntryPicks,
  getFixtures,
} from "@open-fpl/data/features/RemoteData/fpl";
import {
  Event,
  Fixture,
  Team,
} from "@open-fpl/data/features/RemoteData/fplTypes";
import { GetStaticPropsContext, InferGetStaticPropsType } from "next";
import { NextSeo } from "next-seo";
import useSWR from "swr";

export const getStaticPaths = () => {
  return { paths: [], fallback: true };
};

export const getStaticProps = async ({ params }: GetStaticPropsContext) => {
  if (!params || !params.id) {
    // Next.js gets here when rendering the page initially on dev mode
    return {
      props: {},
    };
  }

  if (isNaN(+params!.id)) {
    return {
      props: {
        error:
          "Invalid FPL ID: Please check help page for the instruction to find a valid FPL ID.",
      },
    };
  }

  const [fplTeams, fplGameweeks] = await Promise.all([
    fetch(getDataUrl("/remote-data/fpl_teams/data.json")).then((r) =>
      r.json()
    ) as Promise<Team[]>,
    fetch(getDataUrl("/remote-data/fpl_gameweeks/data.json")).then((r) =>
      r.json()
    ) as Promise<Event[]>,
  ]);

  const currentGameweek = fplGameweeks.find((g) => g.is_current) ?? null;

  const nextGameweek =
    fplGameweeks.find((g) => g.is_next) ??
    fplGameweeks[fplGameweeks.length - 1];

  try {
    const [currentPicks, entry, currentFixtures, nextFixtures] =
      await Promise.all([
        currentGameweek
          ? getEntryPicks(+params!.id!, currentGameweek?.id).then(
              (p) => p.picks
            )
          : null,
        getEntry(+params!.id),
        currentGameweek && getFixtures(currentGameweek.id),
        getFixtures(nextGameweek.id),
      ]);

    return {
      props: {
        fplTeams,
        entry,
        currentGameweek,
        currentFixtures,
        currentPicks,
        nextGameweek,
        nextFixtures,
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

function DashboardPage({
  fplTeams,
  entry,
  currentGameweek,
  // currentFixtures,
  currentPicks,
  nextGameweek,
  nextFixtures,
}: InferGetStaticPropsType<typeof getStaticProps>) {
  const { data: players, error: playersError } = useSWR<Player[]>(
    getDataUrl("/app-data/players.json")
  );

  const isLocalStorageSupported = useIsLocalStorageSupported();

  const currentFixtures: Fixture[] = [
    {
      code: 0,
      event: 1,
      finished: false,
      finished_provisional: false,
      id: 0,
      kickoff_time: new Date().toJSON(),
      minutes: 1,
      provisional_start_time: false,
      started: true,
      team_a: 1,
      team_a_score: 0,
      team_h: 2,
      team_h_score: 0,
      stats: [
        {
          identifier: "bps",
          h: [{ value: 1, element: 1 }],
          a: [{ value: 1, element: 1 }],
        },
        // minutes
        // goals_scored
        // assists
        // clean_sheets
        // goals_conceded
        // own_goals
        // penalties_saved
        // penalties_missed
        // yellow_cards
        // red_cards
        // saves
        // bonus
        // bps
      ],
      team_h_difficulty: 1,
      team_a_difficulty: 1,
    },
    {
      code: 0,
      event: 1,
      finished: false,
      finished_provisional: false,
      id: 1,
      kickoff_time: new Date().toJSON(),
      minutes: 1,
      provisional_start_time: false,
      started: true,
      team_a: 1,
      team_a_score: 0,
      team_h: 2,
      team_h_score: 0,
      stats: [],
      team_h_difficulty: 1,
      team_a_difficulty: 1,
    },
    {
      code: 0,
      event: 1,
      finished: false,
      finished_provisional: false,
      id: 0,
      kickoff_time: new Date().toJSON(),
      minutes: 1,
      provisional_start_time: false,
      started: false,
      team_a: 1,
      team_a_score: 0,
      team_h: 2,
      team_h_score: 0,
      stats: [],
      team_h_difficulty: 1,
      team_a_difficulty: 1,
    },
    {
      code: 0,
      event: 1,
      finished: false,
      finished_provisional: false,
      id: 1,
      kickoff_time: new Date().toJSON(),
      minutes: 1,
      provisional_start_time: false,
      started: false,
      team_a: 1,
      team_a_score: 0,
      team_h: 2,
      team_h_score: 0,
      stats: [],
      team_h_difficulty: 1,
      team_a_difficulty: 1,
    },
    {
      code: 0,
      event: 1,
      finished: true,
      finished_provisional: false,
      id: 0,
      kickoff_time: new Date().toJSON(),
      minutes: 1,
      provisional_start_time: false,
      started: false,
      team_a: 1,
      team_a_score: 0,
      team_h: 2,
      team_h_score: 0,
      stats: [],
      team_h_difficulty: 1,
      team_a_difficulty: 1,
    },
    {
      code: 0,
      event: 1,
      finished: true,
      finished_provisional: false,
      id: 1,
      kickoff_time: new Date().toJSON(),
      minutes: 1,
      provisional_start_time: false,
      started: false,
      team_a: 1,
      team_a_score: 0,
      team_h: 2,
      team_h_score: 0,
      stats: [],
      team_h_difficulty: 1,
      team_a_difficulty: 1,
    },
  ];

  const isReady = [
    players,
    fplTeams,
    entry,
    currentGameweek,
    currentFixtures,
    currentPicks,
    nextGameweek,
    nextFixtures,
  ].every((x) => x !== undefined);

  const errors = [playersError ? "Players" : null].filter((x) => x) as string[];

  let mainContent = null;

  if (isLocalStorageSupported) {
    if (isReady) {
      mainContent = (
        <Dashboard
          as="main"
          players={players!}
          fplTeams={fplTeams!}
          entry={entry!}
          currentGameweek={currentGameweek as Event | null}
          currentFixtures={currentFixtures!}
          currentPicks={currentPicks!}
          nextGameweek={nextGameweek!}
          nextFixtures={nextFixtures!}
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
