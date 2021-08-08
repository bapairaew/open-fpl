import fs from "fs";
import Fuse from "fuse.js";
import path from "path";
import { FPLElement } from "@open-fpl/data/features/AppData/playerDataTypes";
import { Team } from "@open-fpl/data/features/RemoteData/fplTypes";
import getDataFromFiles from "@open-fpl/data/features/RemoteData/getDataFromFiles";
import { PlayerStat } from "@open-fpl/data/features/RemoteData/understatTypes";

// FPL team's short_name, Understat team's title (underscore case)
// NOTE: underscore case is being used in the mapping in pages data while normal case is being used only here
const teamMap: Record<string, string | null> = {
  ARS: "Arsenal",
  AVL: "Aston_Villa",
  BRE: null,
  BHA: "Brighton",
  BUR: "Burnley",
  CHE: "Chelsea",
  CRY: "Crystal_Palace",
  EVE: "Everton",
  LEI: "Leicester",
  LEE: "Leeds",
  LIV: "Liverpool",
  MCI: "Manchester_City",
  MUN: "Manchester_United",
  NEW: "Newcastle_United",
  NOR: null,
  SOU: "Southampton",
  TOT: "Tottenham",
  WAT: null,
  WHU: "West_Ham",
  WOL: "Wolverhampton_Wanderers",
};

async function createTeamsLinks(): Promise<Record<string, string>> {
  const fplTeams = (await fs.promises
    .readFile("./public/remote-data/fpl_teams/data.json", { encoding: "utf-8" })
    .then(JSON.parse)) as Team[];
  const links = fplTeams.reduce((links, team) => {
    const matched = teamMap[team.short_name];
    if (matched) links[team.id] = matched;
    return links;
  }, {} as Record<string, string>);

  return links;
}

async function createPlayersLinks(
  teamsLinks: Record<string, string>
): Promise<Record<string, string>> {
  const [fpl, understat] = await Promise.all([
    (await getDataFromFiles(
      path.resolve("./public/remote-data/fpl")
    )) as FPLElement[],
    (await getDataFromFiles(
      path.resolve("./public/remote-data/understat")
    )) as PlayerStat[],
  ]);

  const teamPlayersMap = understat.reduce((teamPlayersMap, player) => {
    for (const team of player.team_title.split(", ")) {
      if (teamPlayersMap[team]) {
        teamPlayersMap[team].push(player);
      } else {
        teamPlayersMap[team] = [player];
      }
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
    if (teamsLinks[p.team]) {
      const teamTitle = teamsLinks[p.team].replace(/_/g, " "); // reverse id back to title

      const results =
        teamsFuse[teamTitle].search(`${p.first_name} ${p.second_name}`)?.[0] ||
        teamsFuse[teamTitle].search(p.web_name)?.[0] ||
        teamsFuse[teamTitle].search(p.first_name)?.[0] ||
        teamsFuse[teamTitle].search(p.second_name)?.[0];

      if (results) {
        links[p.id] = results.item.id;
      }
    }
    return links;
  }, {} as Record<string, string>);

  return links;
}

(async function () {
  const start = new Date();
  const teamsLinks = await createTeamsLinks();
  const playersLinks = await createPlayersLinks(teamsLinks);
  await fs.promises.writeFile(
    `./public/app-data/links/teams.json`,
    JSON.stringify(teamsLinks, null, 2)
  );
  await fs.promises.writeFile(
    `./public/app-data/links/players.json`,
    JSON.stringify(playersLinks, null, 2)
  );
  console.log(
    `Time elapsed: ${(
      new Date().getTime() - start.getTime()
    ).toLocaleString()}ms`
  );
})();
