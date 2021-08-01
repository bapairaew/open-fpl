import fs from "fs";
import path from "path";
import { makeAppData } from "@open-fpl/data/features/AppData/appData";
import { FPLElement } from "@open-fpl/data/features/AppData/playerDataTypes";
import {
  ElementTypes,
  Event,
  Team,
} from "@open-fpl/data/features/RemoteData/fplTypes";
import getDataFromFiles from "@open-fpl/data/features/RemoteData/getDataFromFiles";
import {
  PlayerStat,
  TeamStat,
} from "@open-fpl/data/features/RemoteData/understatTypes";

(async function () {
  const start = new Date();

  const [
    fpl,
    understat,
    fplTeams,
    fplElementTypes,
    understatTeams,
    playersLinks,
    teamsLinks,
    fplGameweeks,
  ] = await Promise.all([
    (await getDataFromFiles(
      path.resolve("./public/remote-data/fpl")
    )) as FPLElement[],
    (await getDataFromFiles(
      path.resolve("./public/remote-data/understat")
    )) as PlayerStat[],
    fs.promises
      .readFile(path.resolve("./public/remote-data/fpl_teams/data.json"), {
        encoding: "utf-8",
      })
      .then(JSON.parse) as Promise<Team[]>,
    fs.promises
      .readFile(
        path.resolve("./public/remote-data/fpl_element_types/data.json"),
        {
          encoding: "utf-8",
        }
      )
      .then(JSON.parse) as Promise<ElementTypes[]>,
    (await getDataFromFiles(
      path.resolve("./public/remote-data/understat_teams")
    )) as TeamStat[],
    fs.promises
      .readFile(path.resolve("./public/remote-data/links/players.json"), {
        encoding: "utf-8",
      })
      .then(JSON.parse) as Promise<Record<string, string>>,
    fs.promises
      .readFile(path.resolve("./public/remote-data/links/teams.json"), {
        encoding: "utf-8",
      })
      .then(JSON.parse) as Promise<Record<string, string>>,
    fs.promises
      .readFile(path.resolve("./public/remote-data/fpl_gameweeks/data.json"), {
        encoding: "utf-8",
      })
      .then(JSON.parse) as Promise<Event[]>,
  ]);

  const { players, gameweeks, fixtures } = makeAppData({
    fpl,
    understat,
    fplTeams,
    fplElementTypes,
    understatTeams,
    playersLinks,
    teamsLinks,
    fplGameweeks,
  });

  await Promise.all([
    fs.promises.writeFile(
      "./public/app-data/players.json",
      JSON.stringify(players)
    ),
    fs.promises.writeFile(
      "./public/app-data/gameweeks.json",
      JSON.stringify(gameweeks)
    ),
    fs.promises.writeFile(
      "./public/app-data/fixtures.json",
      JSON.stringify(fixtures)
    ),
  ]);

  console.log(
    `Time elapsed: ${(
      new Date().getTime() - start.getTime()
    ).toLocaleString()}ms`
  );
})();
