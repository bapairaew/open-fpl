import { FPLElement } from "@open-fpl/data/features/AppData/playerDataTypes";
import getDataFromFiles from "@open-fpl/data/features/RemoteData/getDataFromFiles";
import {
  PlayerStat,
  TeamStat,
} from "@open-fpl/data/features/RemoteData/understatTypes";
import fs from "fs";
import Fuse from "fuse.js";
import path from "path";

async function updatePlayersLinks(
  playerLinks: Record<string, string>,
  teamsLinks: Record<string, string>
): Promise<Record<string, string>> {
  const [fpl, understat, understatTeams] = await Promise.all([
    (await getDataFromFiles(
      path.resolve("./public/remote-data/fpl")
    )) as FPLElement[],
    (await getDataFromFiles(
      path.resolve("./public/remote-data/understat")
    )) as PlayerStat[],
    (await getDataFromFiles(
      path.resolve("./public/remote-data/understat_teams")
    )) as TeamStat[],
  ]);

  const teamPlayersMap = understat.reduce((teamPlayersMap, player) => {
    const team = player.groupsData.season[0].team;
    if (teamPlayersMap[team]) {
      teamPlayersMap[team].push(player);
    } else {
      teamPlayersMap[team] = [player];
    }
    return teamPlayersMap;
  }, {} as Record<string, PlayerStat[]>);

  const teams = Object.keys(teamPlayersMap);

  const teamsFuse = teams.reduce((teamsFuse, team) => {
    teamsFuse[team] = new Fuse(teamPlayersMap[team], {
      includeScore: true,
      keys: ["player_name"],
      threshold: 0.4,
    });
    return teamsFuse;
  }, {} as Record<string, Fuse<PlayerStat>>);

  const links = fpl.reduce((links, p) => {
    if (!playerLinks[p.id]) {
      if (teamsLinks[p.team]) {
        const teamTitle = understatTeams.find(
          (t) => t.id === teamsLinks[p.team]
        )?.title;

        if (teamTitle) {
          const results =
            teamsFuse[teamTitle].search(
              `${p.first_name} ${p.second_name}`
            )?.[0] ||
            teamsFuse[teamTitle].search(p.web_name)?.[0] ||
            teamsFuse[teamTitle].search(p.first_name)?.[0] ||
            teamsFuse[teamTitle].search(p.second_name)?.[0];

          if (results) {
            links[p.id] = results.item.id;
          }
        }
      }
    } else {
      links[p.id] = playerLinks[p.id];
    }
    return links;
  }, {} as Record<string, string>);

  return links;
}

(async function () {
  const start = new Date();
  const teamsLinks: Record<string, string> = await fs.promises
    .readFile(`./public/app-data/links/teams.json`, {
      encoding: "utf-8",
    })
    .then(JSON.parse);
  const playerLinks: Record<string, string> = await fs.promises
    .readFile(`./public/app-data/links/players.json`, {
      encoding: "utf-8",
    })
    .then(JSON.parse);
  const updatedPlayersLinks = await updatePlayersLinks(playerLinks, teamsLinks);
  await fs.promises.writeFile(
    `./public/app-data/links/players.json`,
    JSON.stringify(updatedPlayersLinks, null, 2)
  );
  console.log(
    `Time elapsed: ${(
      new Date().getTime() - start.getTime()
    ).toLocaleString()}ms`
  );
})();
