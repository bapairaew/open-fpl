import { Spinner } from "@chakra-ui/react";
import fs from "fs";
import { GetStaticPropsContext, InferGetStaticPropsType } from "next";
import { NextSeo } from "next-seo";
import path from "path";
import useSWR from "swr";
import { Gameweek } from "~/features/AppData/appDataTypes";
import UnhandledError from "~/features/Error/UnhandledError";
import AppLayout from "~/features/Layout/AppLayout";
import FullScreenMessage from "~/features/Layout/FullScreenMessage";
import { Player } from "~/features/PlayerData/playerDataTypes";
import {
  getTeamHistory,
  getTeamPicks,
  getTeamTransfers,
} from "~/features/RemoteData/fpl";
import { Event, Team } from "~/features/RemoteData/fplTypes";
import TransferPlanner from "~/features/TransferPlanner/TransferPlanner";
import useTransferRedirect from "~/features/TransferPlanner/useTransferRedirect";

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
    fs.promises
      .readFile(path.resolve("./public/remote-data/fpl_teams/data.json"), {
        encoding: "utf-8",
      })
      .then(JSON.parse) as Promise<Team[]>,
    fs.promises
      .readFile(path.resolve("./public/remote-data/fpl_gameweeks/data.json"), {
        encoding: "utf-8",
      })
      .then(JSON.parse) as Promise<Event[]>,
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
  useTransferRedirect();

  const { data: players, error: playersError } = useSWR<Player[]>(
    "/app-data/players.json"
  );
  const { data: gameweeks, error: gameweeksError } = useSWR<Gameweek[]>(
    "/app-data/gameweeks.json"
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
      <TransferPlanner
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
        text="Please wait while we are preparing your Transfer Planner page."
      />
    );
  }

  return (
    <>
      <NextSeo
        title="Transfer Planner – Open FPL"
        description="Plan your transfer, starting lineup and your bench ahead of upcoming Fantasy Premier League gameweeks."
        noindex={true}
      />
      <AppLayout>{mainContent}</AppLayout>
    </>
  );
};

export default TransferPlannerPage;
