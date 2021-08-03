import { Spinner } from "@chakra-ui/react";
import { useIsLocalStorageSupported } from "@open-fpl/app/features/Common/useLocalStorage";
import getDataUrl from "@open-fpl/app/features/Data/getDataUrl";
import AppLayout from "@open-fpl/app/features/Layout/AppLayout";
import FullScreenMessageWithAppDrawer from "@open-fpl/app/features/Layout/FullScreenMessageWithAppDrawer";
import TeamPlanner from "@open-fpl/app/features/TeamPlanner/TeamPlanner";
import useTeamPlannerRedirect from "@open-fpl/app/features/TeamPlanner/useTeamPlannerRedirect";
import UnhandledError from "@open-fpl/common/features/Error/UnhandledError";
import { TeamFixtures } from "@open-fpl/data/features/AppData/appDataTypes";
import { Player } from "@open-fpl/data/features/AppData/playerDataTypes";
import {
  getTeamHistory,
  getTeamPicks,
  getTeamTransfers,
} from "@open-fpl/data/features/RemoteData/fpl";
import { Event, Team } from "@open-fpl/data/features/RemoteData/fplTypes";
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

  const currentGameweekId = fplGameweeks[0]?.id ?? 38; // Remaining gameweeks is empty when the last gameweek finished

  try {
    const [
      { picks = null, entry_history = null },
      transfers,
      { chips = null },
    ] = await Promise.all([
      getTeamPicks(+params!.id!, currentGameweekId),
      getTeamTransfers(+params!.id!),
      getTeamHistory(+params!.id!),
    ]);

    return {
      props: {
        picks,
        entry_history,
        transfers,
        chips,
        fplTeams,
        teamFixtures,
        currentGameweekId,
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

const TransferPlannerPage = ({
  picks: initialPicks,
  entry_history,
  transfers,
  chips,
  fplTeams,
  error,
  currentGameweekId,
  teamFixtures,
}: InferGetStaticPropsType<typeof getStaticProps>) => {
  useTeamPlannerRedirect();

  const { data: players, error: playersError } = useSWR<Player[]>(
    getDataUrl("/app-data/players.json")
  );

  const isLocalStorageSupported = useIsLocalStorageSupported();

  const isReady = [
    initialPicks,
    entry_history,
    players,
    transfers,
    chips,
    fplTeams,
    teamFixtures,
    currentGameweekId,
  ].every((x) => x !== undefined);

  const errors = [playersError ? "Players" : null].filter((x) => x) as string[];

  let mainContent = null;

  if (isLocalStorageSupported) {
    if (error) {
      mainContent = (
        <UnhandledError
          Wrapper={FullScreenMessageWithAppDrawer}
          as="main"
          additionalInfo={error}
        />
      );
    } else if (isReady) {
      mainContent = (
        <TeamPlanner
          as="main"
          initialPicks={initialPicks ?? null}
          entryHistory={entry_history ?? null}
          players={players!}
          currentGameweekId={currentGameweekId!}
          transfers={transfers!}
          chips={chips!}
          fplTeams={fplTeams!}
          teamFixtures={teamFixtures!}
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
          heading="Almost there..."
          text="Please wait while we are preparing your Team Planner page."
        />
      );
    }
  }

  return (
    <>
      <NextSeo
        title="Team Planner – Open FPL"
        description="Plan your team lineup, transfer, starting lineup and your bench ahead of upcoming Fantasy Premier League gameweeks."
        noindex={true}
      />
      <AppLayout>{mainContent}</AppLayout>
    </>
  );
};

export default TransferPlannerPage;
