import { Spinner } from "@chakra-ui/react";
import { GetStaticPropsContext, InferGetStaticPropsType } from "next";
import { NextSeo } from "next-seo";
import useSWR from "swr";
import getDataUrl from "@open-fpl/app/features/Data/getDataUrl";
import UnhandledError from "@open-fpl/app/features/Error/UnhandledError";
import AppLayout from "@open-fpl/app/features/Layout/AppLayout";
import FullScreenMessage from "@open-fpl/app/features/Layout/FullScreenMessage";
import TeamPlanner from "@open-fpl/app/features/TeamPlanner/TeamPlanner";
import useTeamPlannerRedirect from "@open-fpl/app/features/TeamPlanner/useTeamPlannerRedirect";
import { Gameweek } from "@open-fpl/data/features/AppData/appDataTypes";
import { Player } from "@open-fpl/data/features/AppData/playerDataTypes";
import {
  getTeamHistory,
  getTeamPicks,
  getTeamTransfers,
} from "@open-fpl/data/features/RemoteData/fpl";
import { Event, Team } from "@open-fpl/data/features/RemoteData/fplTypes";

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

  const [fplTeams, fplGameweeks] = await Promise.all([
    fetch(getDataUrl("/remote-data/fpl_teams/data.json")).then((r) =>
      r.json()
    ) as Promise<Team[]>,
    fetch(getDataUrl("/remote-data/fpl_gameweeks/data.json")).then((r) =>
      r.json()
    ) as Promise<Event[]>,
  ]);

  const event = fplGameweeks[0]?.id ?? 38; // Remaining gameweeks is empty when the last gameweek finished
  const [{ picks = null, entry_history = null }, transfers, { chips = null }] =
    await Promise.all([
      getTeamPicks(+params!.id!, event),
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
    },
  };
};

const TransferPlannerPage = ({
  picks: initialPicks,
  entry_history,
  transfers,
  chips,
  fplTeams,
}: InferGetStaticPropsType<typeof getStaticProps>) => {
  useTeamPlannerRedirect();

  const { data: players, error: playersError } = useSWR<Player[]>(
    getDataUrl("/app-data/players.json")
  );
  const { data: gameweeks, error: gameweeksError } = useSWR<Gameweek[]>(
    getDataUrl("/app-data/gameweeks.json")
  );

  const isReady = [
    initialPicks,
    entry_history,
    players,
    gameweeks,
    transfers,
    chips,
    fplTeams,
  ].every((x) => x !== undefined);

  let mainContent = null;

  if (isReady) {
    mainContent = (
      <TeamPlanner
        as="main"
        initialPicks={initialPicks ?? null}
        entryHistory={entry_history ?? null}
        players={players!}
        gameweeks={gameweeks!}
        transfers={transfers!}
        chips={chips!}
        fplTeams={fplTeams!}
      />
    );
  } else if (playersError || gameweeksError) {
    mainContent = (
      <UnhandledError
        as="main"
        additionalInfo={
          playersError
            ? "Players data failed to load"
            : "Gameweeks data failed to load"
        }
      />
    );
  } else {
    mainContent = (
      <FullScreenMessage
        as="main"
        symbol={<Spinner size="xl" />}
        heading="Almost there..."
        text="Please wait while we are preparing your Team Planner page."
      />
    );
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
