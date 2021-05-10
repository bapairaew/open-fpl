import { Box, Grid } from "@theme-ui/components";
import { useResponsiveValue } from "@theme-ui/match-media";
import fs from "fs";
import glob from "glob-promise";
import { NextSeo } from "next-seo";
import { useMemo, useState } from "react";
import AutoSizer from "react-virtualized-auto-sizer";
import { FixedSizeList as List } from "react-window";
import PlayerCard from "~/components/PlayerCard";
import PlayerSearchBar, {
  SEARCH_BAR_HEIGHT,
} from "~/components/PlayerSearchBar";

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
    await getDataFromFiles("./data/fpl/*.json"),
    await getDataFromFiles("./data/understat/*.json"),
    fs.promises.readFile("./data/fpl_teams/data.json").then(JSON.parse),
    await getDataFromFiles("./data/understat_teams/*.json"),
    fs.promises.readFile("./data/links/players.json").then(JSON.parse),
    fs.promises.readFile("./data/links/teams.json").then(JSON.parse),
    fs.promises.readFile("./data/fpl_gameweeks/data.json").then(JSON.parse),
    fs.promises.readFile("./data/teamcolorcodes/data.json").then(JSON.parse),
  ]);

  const fplTeamsMap = fplTeams.reduce((map, t) => ({ ...map, [t.id]: t }), {});

  const gameweeks = fplGameweeks
    .filter((g) => !g.finished && !g.current)
    .slice(0, 5)
    .map((gw) => ({
      id: gw.id,
      deadline_time: "2021-05-23T13:30:00Z",
      is_previous: gw.is_previous,
      is_current: gw.is_current,
      is_next: gw.is_next,
    }));

  const nextGameweeks = gameweeks.map((x) => x.id);

  const teams = fplTeams.map((team) => {
    const stats = teamsLinks[team.id]
      ? understatTeams.find((t) => t.id === teamsLinks[team.id])
      : null;
    return {
      id: team.id,
      name: team.name,
      short_name: team.short_name,
      strength_overall_home: team.strength_overall_home,
      strength_overall_away: team.strength_overall_away,
      strength_attack_home: team.strength_attack_home,
      strength_attack_away: team.strength_attack_away,
      strength_defence_home: team.strength_defence_home,
      strength_defence_away: team.strength_defence_away,
      color_codes: teamcolorcodes.find((c) => c.team === stats.title) || null,
    };
  });

  const teamsMap = teams.reduce(
    (map, team) => ({ ...map, [team.id]: team }),
    {}
  );

  const players = fpl
    .filter((p) => p.status !== "u")
    .map((player) => {
      const playerStats = playersLinks[player.id]
        ? understat.find((p) => p.id === playersLinks[player.id])
        : null;
      return {
        id: player.id,
        name: player.name,
        web_name: player.web_name,
        news: player.news,
        status: player.status,
        now_cost: player.now_cost,
        photo: player.photo,
        chance_of_playing_next_round: player.chance_of_playing_next_round,
        chance_of_playing_this_round: player.chance_of_playing_this_round,
        total_points: player.total_points,
        element_type: {
          singular_name_short: player.element_type.singular_name_short,
        },
        team: {
          id: player.team.id,
          short_name: player.team.short_name,
          ...teamsMap[player.team.id],
        },
        previous_gameweeks: player.history
          .filter((h) => h.team_h_score !== null) // Only show the game the already played
          .slice(-5)
          .map((h) => ({
            opponent_team_short_name: fplTeams.find(
              (t) => t.id === h.opponent_team
            ).short_name,
            was_home: h.was_home,
            kickoff_time: h.kickoff_time,
            total_points: h.total_points,
            bps: h.bps,
            minutes: h.minutes,
          })),
        next_gameweeks: player.fixtures
          .filter((f) => nextGameweeks.includes(f.event))
          .map((f) => ({
            opponent: f.is_home
              ? fplTeamsMap[f.team_a].short_name
              : fplTeamsMap[f.team_h].short_name,
            is_home: f.is_home,
            event: f.event,
            finished: f.finished,
            difficulty: f.difficulty,
          })),
        stats: playerStats
          ? (function () {
              // TODO: handle the case where a player moved mid-season to another PL team
              const playerTeam = playerStats?.groupsData?.season[0].team;
              const last5Matches = playerStats?.matchesData
                .slice(0, 5)
                .reverse();
              const playerTeamUnderstat = understatTeams.find(
                (t) => t.title === playerTeam
              );
              return {
                id: playerStats.id,
                matches: last5Matches.map((m) => {
                  const isHome = m.h_team === playerTeam;
                  const opponent = isHome
                    ? understatTeams.find((t) => t.title === m.a_team)
                    : understatTeams.find((t) => t.title === m.h_team);
                  const fplOpponentId = Object.keys(teamsLinks).find(
                    (key) => teamsLinks[key] === opponent?.id
                  );
                  return {
                    opponent_short_title:
                      fplTeams.find((t) => t.id === +fplOpponentId)
                        ?.short_name || null,
                    is_home: isHome,
                    match_xgi: +m.xA + +m.xG,
                    match_xga: +opponent?.datesData.find((d) => m.id === d.id)
                      ?.xG?.[isHome ? "a" : "h"],
                  };
                }),
                season_xgi:
                  ((+playerStats.xA + +playerStats.xG) * 90) /
                  +playerStats.time,
                season_xga:
                  playerTeamUnderstat?.history.reduce((x, m) => +m.xGA + x, 0) /
                  playerTeamUnderstat?.history.length,
              };
            })()
          : null,
      };
    });

  return {
    props: {
      players,
      teams,
      gameweeks,
    },
  };
};

function HomePage({ players: allPlayers, gameweeks }) {
  const columnsSettings = [1, 2, 3];
  const columnsCount = useResponsiveValue(columnsSettings);
  const [players, setPlayers] = useState(allPlayers);

  const Row = useMemo(
    () => ({ index: rowIndex, style }) => {
      const content = [];
      for (let columnIndex = 0; columnIndex < columnsCount; columnIndex++) {
        const player = players[rowIndex * columnsCount + columnIndex];
        if (player) {
          content.push(
            <Box key={player.id} sx={{ height: "100%" }}>
              <PlayerCard player={player} gameweeks={gameweeks} />
            </Box>
          );
        }
      }

      return (
        <div key={`${rowIndex}`} style={style}>
          <Grid
            columns={columnsSettings}
            gap={2}
            py={1}
            px={1}
            sx={{ height: "100%" }}
          >
            {content}
          </Grid>
        </div>
      );
    },
    [players, gameweeks, columnsCount]
  );

  return (
    <>
      <NextSeo title="Player Explorer | Open FPL" />
      <PlayerSearchBar onResults={setPlayers} players={allPlayers} />
      <AutoSizer>
        {({ height, width }) => (
          <List
            height={height - SEARCH_BAR_HEIGHT}
            itemCount={Math.ceil(players.length / columnsCount)}
            itemSize={260}
            width={width}
          >
            {Row}
          </List>
        )}
      </AutoSizer>
    </>
  );
}

export default HomePage;
