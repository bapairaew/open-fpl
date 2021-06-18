import fs from "fs";
import { GetStaticProps, InferGetStaticPropsType } from "next";
import { NextSeo } from "next-seo";
import path from "path";
import { makeAppData } from "~/features/AppData/appData";
import { FPLElement } from "~/features/AppData/appDataTypes";
import { getTeamPicks, getTeamTransfers } from "~/features/AppData/fpl";
import { ElementTypes, Event, Team } from "~/features/AppData/fplTypes";
import { TeamColorCodes } from "~/features/AppData/teamcolorcodesTypes";
import { PlayerStat, TeamStat } from "~/features/AppData/understatTypes";
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

export const getStaticProps: GetStaticProps = async ({ params }) => {
  if (params && params.id) {
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
      (await getDataFromFiles(
        path.resolve("./public/data/fpl")
      )) as FPLElement[],
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

    const event = gameweeks?.[0]?.id ?? 38;
    const { picks, entry_history } = await getTeamPicks(+params.id, event);
    const transfers = await getTeamTransfers(+params.id);

    return {
      props: {
        players,
        gameweeks,
        picks,
        entry_history,
        transfers,
      },
    };
  } else {
    return {
      props: {},
    };
  }
};

const TransferPlannerPage = ({
  picks: initialPicks,
  entry_history,
  players,
  gameweeks,
  transfers,
}: InferGetStaticPropsType<typeof getStaticProps>) => {
  useTransferRedirect();
  return (
    <>
      <NextSeo
        title="Transfer Planner | Open FPL"
        description="Plan your transfer, starting lineup and your bench ahead of upcoming Fantasy Premier League gameweeks"
        noindex={true}
      />
      <TransferPlanner
        initialPicks={initialPicks}
        entryHistory={entry_history}
        players={players}
        gameweeks={gameweeks}
        transfers={transfers}
      />
    </>
  );
};

export default TransferPlannerPage;
