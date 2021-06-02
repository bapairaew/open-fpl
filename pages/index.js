import fs from "fs";
import glob from "glob-promise";
import { NextSeo } from "next-seo";
import path from "path";
import PlayersExplorer from "~/components/PlayersExplorer/PlayersExplorer";
import { makePlayersData } from "~/libs/players";

const mp = (p) => path.resolve(`./public/${p}`);

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
    await getDataFromFiles(mp("data/fpl/*.json")),
    await getDataFromFiles(mp("data/understat/*.json")),
    fs.promises.readFile(mp("data/fpl_teams/data.json")).then(JSON.parse),
    await getDataFromFiles(mp("data/understat_teams/*.json")),
    fs.promises.readFile(mp("data/links/players.json")).then(JSON.parse),
    fs.promises.readFile(mp("data/links/teams.json")).then(JSON.parse),
    fs.promises.readFile(mp("data/fpl_gameweeks/data.json")).then(JSON.parse),
    fs.promises.readFile(mp("data/teamcolorcodes/data.json")).then(JSON.parse),
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
