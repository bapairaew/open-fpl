import fs from "fs";
import { InferGetStaticPropsType } from "next";
import { NextSeo } from "next-seo";
import path from "path";
import { makeAppData } from "~/features/AppData/appData";
import { FPLElement } from "~/features/AppData/appDataTypes";
import { ElementTypes, Event, Team } from "~/features/AppData/fplTypes";
import { TeamColorCodes } from "~/features/AppData/teamcolorcodesTypes";
import { PlayerStat, TeamStat } from "~/features/AppData/understatTypes";
import PlayersExplorer from "~/features/PlayersExplorer/PlayersExplorer";

const getDataFromFiles = async (dirPath: string) => {
  return Promise.all(
    (await fs.promises.readdir(dirPath)).map((p) =>
      fs.promises
        .readFile(path.join(dirPath, p), { encoding: "utf-8" })
        .then(JSON.parse)
    )
  );
};

export const getStaticProps = async () => {
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

  return {
    props: {
      players,
      gameweeks,
    },
  };
};

function HomePage({
  players,
  gameweeks,
}: InferGetStaticPropsType<typeof getStaticProps>) {
  return (
    <>
      <NextSeo
        title="Player Explorer | Open FPL"
        description="Explore Fantasy Premier League player statistics to make a better decision on your team."
      />
      <PlayersExplorer as="main" players={players} gameweeks={gameweeks} />
    </>
  );
}

export default HomePage;
