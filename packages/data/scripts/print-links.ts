// Use this script to check if the link between FPL data and Understat data is correct
// It will create players.temp.tsv file which shows the players where their name is not the exact match

import { FPLElement } from "@open-fpl/data/features/AppData/playerDataTypes";
import { Team } from "@open-fpl/data/features/RemoteData/fplTypes";
import getDataFromFiles from "@open-fpl/data/features/RemoteData/getDataFromFiles";
import { PlayerStat } from "@open-fpl/data/features/RemoteData/understatTypes";
import fs from "fs";
import path from "path";
// @ts-ignore
import stringSimilarity from "string-similarity";

async function printPlayersLink({
  fpl,
  understat,
  links,
  fplTeams,
}: {
  fpl: FPLElement[];
  understat: PlayerStat[];
  links: Record<string, string>;
  fplTeams: Team[];
}) {
  const tsv = Object.entries(links)
    .reduce((list, [fplId, understatId]) => {
      const fplObject = fpl.find((f) => f.id === +fplId);
      const understatObject = understat.find((u) => u.id === understatId);
      if (fplObject && understatObject) {
        const fplMins = fplObject.minutes;
        const fplName = `${fplObject.first_name} ${fplObject.second_name}`;
        const fplTeam = fplTeams.find(
          (t) => t.id === fplObject.team
        )?.short_name;
        const fplWebName = fplObject.web_name;
        const understatName = understatObject.player_name;
        const understatMins = understatObject.time;
        const fplNews = fplObject.news;
        list.push([
          stringSimilarity.compareTwoStrings(fplName, understatName).toFixed(2),
          `${Math.abs(+fplMins - +understatMins)}`.padStart(5, " "),
          `${fplId}`.padStart(4, " "),
          `${understatId}`.padStart(4, " "),
          fplTeam,
          fplWebName.padStart(20, " "),
          understatName.padStart(30, " "),
          fplNews,
        ]);
      }
      return list;
    }, [] as any[][])
    .filter(([a]) => a < 1)
    .sort(([, a], [, b]) => (a > b ? 1 : -1))
    .map((r) => r.join("\t"))
    .join("\n");

  await fs.promises.writeFile("./players.temp.tsv", tsv);
  console.log(`Printed players link: ./players.temp.tsv`);
}

async function printDuplicatedLinks({
  fpl,
  understat,
  links,
}: {
  fpl: FPLElement[];
  understat: PlayerStat[];
  links: Record<string, string>;
}) {
  const reversedMap: Record<string, string[]> = {};
  for (const [key, value] of Object.entries(links)) {
    reversedMap[value] = reversedMap[value]
      ? reversedMap[value].concat(key)
      : [key];
  }
  const tsv = Object.keys(reversedMap)
    .filter((key) => reversedMap[key].length > 1)
    .map((key) => {
      const understatPlayer = understat.find((f) => f.id === key);
      const duplicated = reversedMap[key].map((id) => {
        const matched = fpl.find((u) => u.id === +id);
        return matched ?? { id, web_name: "N/A" };
      });
      return [
        `(${key}) ${understatPlayer?.player_name}`.padStart(30, " "),
        ...duplicated.map((d) => `(${d?.id}) ${d?.web_name}`.padStart(30, " ")),
      ].join("\t");
    })
    .join("\n");
  await fs.promises.writeFile("./players.duplicated.temp.tsv", tsv);
  console.log(`Printed duplicated links: ./players.duplicated.temp.tsv`);
}

async function printUnlinkedPlayers({
  fpl,
  links,
}: {
  fpl: FPLElement[];
  understat: PlayerStat[];
  links: Record<string, string>;
  fplTeams: Team[];
}) {
  const tsv = fpl
    .filter((player) => links[player.id] === undefined)
    .map((player) =>
      [
        player.web_name.padStart(20, " "),
        `${player.id}`.padStart(6, " "),
        `${player.minutes}`.padStart(6, " "),
      ].join("\t")
    )
    .join("\n");

  await fs.promises.writeFile("./players.unlinked.temp.tsv", tsv);
  console.log(`Printed unlinked players: ./players.unlinked.temp.tsv`);
}

(async function () {
  const start = new Date();
  const [fpl, understat, links, fplTeams] = await Promise.all([
    (await getDataFromFiles(
      path.resolve("./public/remote-data/fpl")
    )) as FPLElement[],
    (await getDataFromFiles(
      path.resolve("./public/remote-data/understat")
    )) as PlayerStat[],
    fs.promises
      .readFile(path.resolve("./public/app-data/links/players.json"), {
        encoding: "utf-8",
      })
      .then(JSON.parse) as Promise<Record<string, string>>,
    fs.promises
      .readFile(path.resolve("./public/remote-data/fpl_teams/data.json"), {
        encoding: "utf-8",
      })
      .then(JSON.parse) as Promise<Team[]>,
  ]);
  await printPlayersLink({ fpl, understat, links, fplTeams });
  await printDuplicatedLinks({ fpl, understat, links });
  await printUnlinkedPlayers({ fpl, understat, links, fplTeams });
  console.log(
    `Time elapsed: ${(
      new Date().getTime() - start.getTime()
    ).toLocaleString()}ms`
  );
})();
