import fs from "fs";
import glob from "glob-promise";
import { NextSeo } from "next-seo";
import path from "path";
import PlayersExplorer from "~/components/PlayersExplorer/PlayersExplorer";
import { makePlayersData } from "~/libs/players";

const getDataFromFiles = async (pattern) => {
  return Promise.all(
    (await glob(pattern)).map((p) => fs.promises.readFile(p).then(JSON.parse))
  );
};

export const getStaticProps = async () => {
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
    await getDataFromFiles(path.resolve("./public/data/fpl/*.json")),
    await getDataFromFiles(path.resolve("./public/data/understat/*.json")),
    fs.promises
      .readFile(path.resolve("./public/data/fpl_teams/data.json"))
      .then(JSON.parse),
    await getDataFromFiles(
      path.resolve("./public/data/understat_teams/*.json")
    ),
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

  console.log(fpl);

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

  return {
    props: {
      players,
      gameweeks,
    },
  };
};

function HomePage({ players, gameweeks }) {
  return (
    <>
      <NextSeo title="Player Explorer | Open FPL" />
      <PlayersExplorer
        columnsSettings={{ xs: 1, sm: 1, md: 2, lg: 3, xl: 4, "2xl": 5 }}
        players={players}
        gameweeks={gameweeks}
      />
    </>
  );
}

export default HomePage;
