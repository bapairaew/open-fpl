import Fuse from "fuse.js";
import fs from "fs";
import glob from "glob-promise";

async function createTeamsLinks() {
  const [fplTeams, understatTeams] = await Promise.all([
    fs.promises.readFile("./data/fpl_teams/data.json").then(JSON.parse),
    Promise.all(
      (
        await glob("./data/understat_teams/*.json")
      ).map((p) => fs.promises.readFile(p).then(JSON.parse))
    ),
  ]);

  const teamsNameFuse = new Fuse(
    understatTeams.map((t) => t.title),
    {
      includeScore: true,
      threshold: 0.5,
    }
  );

  const links = fplTeams.reduce((links, team) => {
    const matched =
      team.short_name === "MUN" // HOTFIX invalid man city / man utd matching
        ? { item: "Manchester United" }
        : teamsNameFuse.search(team.name)?.[0] ||
          teamsNameFuse.search(team.short_name)?.[0];
    if (matched?.item) links[team.id] = matched.item.replace(/ /g, "_"); // title is being used as reference instead of actual id in other dataset
    return links;
  }, {});

  return links;
}

async function createPlayersLinks(teamsLinks) {
  const [fpl, understat] = await Promise.all([
    Promise.all(
      (
        await glob("./data/fpl/*.json")
      ).map((p) => fs.promises.readFile(p).then(JSON.parse))
    ),
    Promise.all(
      (
        await glob("./data/understat/*.json")
      ).map((p) => fs.promises.readFile(p).then(JSON.parse))
    ),
  ]);

  const teamPlayersMap = understat.reduce((teamPlayersMap, player) => {
    for (const team of player.teams) {
      if (teamPlayersMap[team]) {
        teamPlayersMap[team].push(player);
      } else {
        teamPlayersMap[team] = [player];
      }
    }
    return teamPlayersMap;
  }, {});

  const teams = Object.keys(teamPlayersMap);

  const teamsFuse = teams.reduce((teamsFuse, team) => {
    teamsFuse[team] = new Fuse(teamPlayersMap[team], {
      includeScore: true,
      keys: ["player_name"],
      threshold: 0.4,
    });
    return teamsFuse;
  }, {});

  const links = fpl.reduce((links, p) => {
    const teamTitle = teamsLinks[p.team.id].replace(/_/g, " "); // reverse id back to title

    const results =
      teamsFuse[teamTitle].search(p.name)?.[0] ||
      teamsFuse[teamTitle].search(p.web_name)?.[0] ||
      teamsFuse[teamTitle].search(p.first_name)?.[0] ||
      teamsFuse[teamTitle].search(p.second_name)?.[0];

    if (results) {
      links[p.id] = results.item.id;
    }

    return links;
  }, {});

  return links;
}

(async function () {
  const start = new Date();
  const teamsLinks = await createTeamsLinks();
  const playersLinks = await createPlayersLinks(teamsLinks);
  await fs.promises.writeFile(
    `./data/links/teams.json`,
    JSON.stringify(teamsLinks, null, 2)
  );
  await fs.promises.writeFile(
    `./data/links/players.json`,
    JSON.stringify(playersLinks, null, 2)
  );
  console.log(`Time elapsed: ${(new Date() - start).toLocaleString()}ms`);
})();
