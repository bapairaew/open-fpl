// Use this script to check if the link between FPL data and Understat data is correct
// It will create players.temp.tsv file which shows the players where their name is not the exact match

import fs from "fs";
import glob from "glob-promise";
import stringSimilarity from "string-similarity";

async function printPlayerLinks() {
  const [fpl, understat, links] = await Promise.all([
    Promise.all(
      (
        await glob("./public/data/fpl/*.json")
      ).map((p) => fs.promises.readFile(p).then(JSON.parse))
    ),
    Promise.all(
      (
        await glob("./public/data/understat/*.json")
      ).map((p) => fs.promises.readFile(p).then(JSON.parse))
    ),
    fs.promises.readFile("./public/data/links/players.json").then(JSON.parse),
  ]);

  const tsv = Object.entries(links)
    .map(([fplId, understatId]) => {
      const fplObject = fpl.find((f) => f.id === +fplId);
      const fplMins = fplObject.minutes;
      const fplName = fplObject.name;
      const fplWebName = fplObject.web_name;
      const understatObject = understat.find((u) => u.id === understatId);
      const understatName = understatObject.player_name;
      const understatMins = understatObject.time;
      return [
        stringSimilarity.compareTwoStrings(fplName, understatName).toFixed(2),
        `${Math.abs(+fplMins - +understatMins)}`.padStart(5, " "),
        `${fplId}`.padStart(4, " "),
        `${understatId}`.padStart(4, " "),
        fplWebName,
        understatName,
      ];
    })
    .filter(([a]) => a < 1)
    .sort(([, a], [, b]) => (a > b ? 1 : -1))
    .map((r) => r.join("\t"))
    .join("\n");

  await fs.promises.writeFile("./players.temp.tsv", tsv);
}

(async function () {
  await printPlayerLinks();
})();
