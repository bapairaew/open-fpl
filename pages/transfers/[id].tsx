import { Spinner } from "@chakra-ui/react";
import fs from "fs";
import { GetStaticPropsContext, InferGetStaticPropsType } from "next";
import { NextSeo } from "next-seo";
import path from "path";
import { makeAppData } from "~/features/AppData/appData";
import {
  getTeamHistory,
  getTeamPicks,
  getTeamTransfers,
} from "~/features/AppData/fpl";
import { ElementTypes, Event, Team } from "~/features/AppData/fplTypes";
import { TeamColorCodes } from "~/features/AppData/teamcolorcodesTypes";
import { PlayerStat, TeamStat } from "~/features/AppData/understatTypes";
import AppLayout from "~/features/Layout/AppLayout";
import FullScreenMessage from "~/features/Layout/FullScreenMessage";
import { FPLElement } from "~/features/PlayerData/playerDataTypes";
import TransferPlanner from "~/features/TransferPlanner/TransferPlanner";
import useTransferRedirect from "~/features/TransferPlanner/useTransferRedirect";

const getDataFromFiles = async (dirPath: string) => {
  return Promise.all(
    (await fs.promises.readdir(dirPath)).map((p) =>
      fs.promises
        .readFile(path.join(dirPath, p), { encoding: "utf-8" })
        .then(JSON.parse)
    )
  );
};

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

  const [
    fpl,
    understat,
    fplTeams,
    fplElementTypes,
    understatTeams,
    playersLinks,
    teamsLinks,
    fplGameweeks,
    teamcolorcodes,
  ] = await Promise.all([
    (await getDataFromFiles(path.resolve("./public/data/fpl"))) as FPLElement[],
    (await getDataFromFiles(
      path.resolve("./public/data/understat")
    )) as PlayerStat[],
    fs.promises
      .readFile(path.resolve("./public/data/fpl_teams/data.json"), {
        encoding: "utf-8",
      })
      .then(JSON.parse) as Promise<Team[]>,
    fs.promises
      .readFile(path.resolve("./public/data/fpl_element_types/data.json"), {
        encoding: "utf-8",
      })
      .then(JSON.parse) as Promise<ElementTypes[]>,
    (await getDataFromFiles(
      path.resolve("./public/data/understat_teams")
    )) as TeamStat[],
    fs.promises
      .readFile(path.resolve("./public/data/links/players.json"), {
        encoding: "utf-8",
      })
      .then(JSON.parse) as Promise<Record<string, string>>,
    fs.promises
      .readFile(path.resolve("./public/data/links/teams.json"), {
        encoding: "utf-8",
      })
      .then(JSON.parse) as Promise<Record<string, string>>,
    fs.promises
      .readFile(path.resolve("./public/data/fpl_gameweeks/data.json"), {
        encoding: "utf-8",
      })
      .then(JSON.parse) as Promise<Event[]>,
    fs.promises
      .readFile(path.resolve("./public/data/teamcolorcodes/data.json"), {
        encoding: "utf-8",
      })
      .then(JSON.parse) as Promise<TeamColorCodes[]>,
  ]);

  // TODO: move this to client level?
  const { players, gameweeks } = makeAppData({
    fpl,
    understat,
    fplTeams,
    fplElementTypes,
    understatTeams,
    playersLinks,
    teamsLinks,
    fplGameweeks,
    teamcolorcodes,
  });

  const event = gameweeks[0]?.id ?? 38; // Remaining gameweeks is empty when the last gameweek finished
  const [{ picks = null, entry_history = null }, transfers, { chips = null }] =
    await Promise.all([
      getTeamPicks(+params!.id!, event),
      getTeamTransfers(+params!.id!),
      getTeamHistory(+params!.id!),
    ]);

  return {
    props: {
      players,
      gameweeks,
      picks,
      entry_history,
      transfers,
      chips,
    },
  };
};

const TransferPlannerPage = ({
  picks: initialPicks,
  entry_history,
  players,
  gameweeks,
  transfers,
  chips,
}: InferGetStaticPropsType<typeof getStaticProps>) => {
  useTransferRedirect();

  const isReady = [
    initialPicks,
    entry_history,
    players,
    gameweeks,
    transfers,
    chips,
  ].every((x) => x !== undefined);

  const mainComponent = isReady ? (
    <TransferPlanner
      as="main"
      initialPicks={initialPicks ?? null}
      entryHistory={entry_history ?? null}
      players={players!}
      gameweeks={gameweeks!}
      transfers={transfers!}
      chips={chips!}
    />
  ) : (
    <FullScreenMessage
      symbol={<Spinner size="xl" />}
      heading="Almost there..."
      text={"Please wait while we are preparing your Transfer Planner page."}
    />
  );

  return (
    <>
      <NextSeo
        title="Transfer Planner – Open FPL"
        description="Plan your transfer, starting lineup and your bench ahead of upcoming Fantasy Premier League gameweeks."
        noindex={true}
      />
      <AppLayout>{mainComponent}</AppLayout>
    </>
  );
};

export default TransferPlannerPage;
