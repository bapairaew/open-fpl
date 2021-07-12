// Use this script to check if the link between FPL data and Understat data is correct
// It will create players.temp.tsv file which shows the players where their name is not the exact match

import fs from "fs";
import path from "path";
// @ts-ignore
import stringSimilarity from "string-similarity";
import { getDataFromFiles } from "~/features/AppData/dataUtilis";
import { PlayerStat } from "~/features/AppData/understatTypes";
import { FPLElement } from "~/features/PlayerData/playerDataTypes";

const printPath = "./players.temp.tsv";

async function printPlayerLinks() {
  const [fpl, understat, links] = await Promise.all([
    (await getDataFromFiles(path.resolve("./public/data/fpl"))) as FPLElement[],
    (await getDataFromFiles(
      path.resolve("./public/data/understat")
    )) as PlayerStat[],
    fs.promises
      .readFile(path.resolve("./public/data/links/players.json"), {
        encoding: "utf-8",
      })
      .then(JSON.parse) as Promise<Record<string, string>>,
  ]);

  const tsv = Object.entries(links)
    .reduce((list, [fplId, understatId]) => {
      const fplObject = fpl.find((f) => f.id === +fplId);
      const understatObject = understat.find((u) => u.id === understatId);
      if (fplObject && understatObject) {
        const fplMins = fplObject.minutes;
        const fplName = `${fplObject.first_name} ${fplObject.second_name}`;
        const fplWebName = fplObject.web_name;
        const understatName = understatObject.player_name;
        const understatMins = understatObject.time;
        list.push([
          stringSimilarity.compareTwoStrings(fplName, understatName).toFixed(2),
          `${Math.abs(+fplMins - +understatMins)}`.padStart(5, " "),
          `${fplId}`.padStart(4, " "),
          `${understatId}`.padStart(4, " "),
          fplWebName,
          understatName,
        ]);
      }
      return list;
    }, [] as any[][])
    .filter(([a]) => a < 1)
    .sort(([, a], [, b]) => (a > b ? 1 : -1))
    .map((r) => r.join("\t"))
    .join("\n");

  await fs.promises.writeFile(printPath, tsv);
}

(async function () {
  const start = new Date();
  await printPlayerLinks();
  console.log(
    `Time elapsed: ${(
      new Date().getTime() - start.getTime()
    ).toLocaleString()}ms`
  );

  console.log(`Please find the results here: ${printPath}`);
})();
