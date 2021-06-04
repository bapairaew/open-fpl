import fs from "fs";
import { NextSeo } from "next-seo";
import path from "path";
import PlayersExplorer from "~/components/PlayersExplorer/PlayersExplorer";
import { makePlayersData } from "~/libs/players";

const getDataFromFiles = async (dirPath) => {
  return Promise.all(
    (await fs.promises.readdir(dirPath)).map((p) =>
      fs.promises.readFile(path.join(dirPath, p)).then(JSON.parse)
    )
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
      <NextSeo
        title="Player Explorer | Open FPL"
        description="Explore Fantasy Premier League player statistics to make a better decision on your team."
      />
      <PlayersExplorer
        columnsSettings={{ xs: 1, sm: 1, md: 2, lg: 3, xl: 4, "2xl": 5 }}
        players={players}
        gameweeks={gameweeks}
      />
    </>
  );
}

export default HomePage;
