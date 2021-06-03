import fs from "fs";
import glob from "glob-promise";
import { NextSeo } from "next-seo";
import path from "path";
import TransferPlanner from "~/components/TransferPlanner/TransferPlanner";
import useTransferRedirect from "~/components/TransferPlanner/useTransferRedirect";
import { getTeamPicks, getTeamTransfers } from "~/libs/fpl";
import { makePlayersData } from "~/libs/players";

const getDataFromFiles = async (pattern) => {
  return Promise.all(
    (await glob(pattern)).map((p) => fs.promises.readFile(p).then(JSON.parse))
  );
};

export const getServerSideProps = async ({ params }) => {
  const [
    fpl,
    understat,
    fplTeams,
    understatTeams,
    playersLinks,
    teamsLinks,
    fplGameweeks,
    teamcolorcodes,
  ] = await Promise.all([
    await getDataFromFiles(path.resolve("data/fpl/*.json")),
    await getDataFromFiles(path.resolve("data/understat/*.json")),
    fs.promises
      .readFile(path.resolve("data/fpl_teams/data.json"))
      .then(JSON.parse),
    await getDataFromFiles(path.resolve("data/understat_teams/*.json")),
    fs.promises
      .readFile(path.resolve("data/links/players.json"))
      .then(JSON.parse),
    fs.promises
      .readFile(path.resolve("data/links/teams.json"))
      .then(JSON.parse),
    fs.promises
      .readFile(path.resolve("data/fpl_gameweeks/data.json"))
      .then(JSON.parse),
    fs.promises
      .readFile(path.resolve("data/teamcolorcodes/data.json"))
      .then(JSON.parse),
  ]);

  const { players, gameweeks } = makePlayersData({
    fpl,
    understat,
    fplTeams,
    understatTeams,
    playersLinks,
    teamsLinks,
    fplGameweeks,
    teamcolorcodes,
  });

  const event = gameweeks?.[0]?.id ?? 38;
  const { picks, entry_history } = await getTeamPicks(params.id, event);
  const transfers = await getTeamTransfers(params.id);

  return {
    props: {
      players,
      gameweeks,
      picks,
      entry_history,
      transfers,
    },
  };
};

const TransferPlannerPage = ({
  picks: initialPicks,
  entry_history,
  players,
  gameweeks,
  transfers,
}) => {
  useTransferRedirect();
  return (
    <>
      <NextSeo title="Transfer Planner | Open FPL" />
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
