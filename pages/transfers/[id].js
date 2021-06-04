import fs from "fs";
import { NextSeo } from "next-seo";
import path from "path";
import TransferPlanner from "~/components/TransferPlanner/TransferPlanner";
import useTransferRedirect from "~/components/TransferPlanner/useTransferRedirect";
import { getTeamPicks, getTeamTransfers } from "~/libs/fpl";
import { makePlayersData } from "~/libs/players";

const getDataFromFiles = async (dirPath) => {
  return Promise.all(
    (await fs.promises.readdir(dirPath)).map((p) =>
      fs.promises.readFile(path.join(dirPath, p)).then(JSON.parse)
    )
  );
};

export const getStaticPaths = () => {
  return { paths: [], fallback: true };
};

export const getStaticProps = async ({ params }) => {
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
    await getDataFromFiles(path.resolve("./public/data/fpl")),
    await getDataFromFiles(path.resolve("./public/data/understat")),
    fs.promises
      .readFile(path.resolve("./public/data/fpl_teams/data.json"))
      .then(JSON.parse),
    await getDataFromFiles(path.resolve("./public/data/understat_teams")),
    fs.promises
      .readFile(path.resolve("./public/data/links/players.json"))
      .then(JSON.parse),
    fs.promises
      .readFile(path.resolve("./public/data/links/teams.json"))
      .then(JSON.parse),
    fs.promises
      .readFile(path.resolve("./public/data/fpl_gameweeks/data.json"))
      .then(JSON.parse),
    fs.promises
      .readFile(path.resolve("./public/data/teamcolorcodes/data.json"))
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
