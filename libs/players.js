export const makePlayersData = ({
  fpl,
  understat,
  fplTeams,
  understatTeams,
  playersLinks,
  teamsLinks,
  fplGameweeks,
  teamcolorcodes,
}) => {
  const gameweeks = fplGameweeks
    .filter((g) => !g.finished && !g.is_current)
    .slice(0, 5)
    .map((gw) => ({
      id: gw.id,
      deadline_time: gw.deadline_time,
      is_previous: gw.is_previous,
      is_current: gw.is_current,
      is_next: gw.is_next,
    }));

  const nextGameweekIds = gameweeks.map((x) => x.id);

  const fplTeamsMap = fplTeams.reduce((fplTeamsMap, t) => {
    fplTeamsMap[t.id] = t;
    return fplTeamsMap;
  }, {});
  const understatTeamsMap = understatTeams.reduce((understatTeamsMap, t) => {
    understatTeamsMap[t.title] = t;
    return understatTeamsMap;
  }, {});
  const teamcolorcodesMap = teamcolorcodes.reduce((teamcolorcodesMap, code) => {
    teamcolorcodesMap[code.team] = code;
    return teamcolorcodesMap;
  }, {});

  const players = fpl
    .filter((p) => p.status !== "u")
    .map((player) => {
      const playerStats = playersLinks[player.id]
        ? understat.find((p) => p.id === playersLinks[player.id]) || null
        : null;
      // TODO: handle the case where a player moved mid-season to another PL team
      const playerTeam = playerStats?.groupsData?.season[0].team;
      const pastMatches =
        playerStats?.matchesData.slice(0, 5).reverse() || null;
      const playerTeamUnderstat = understatTeamsMap[playerTeam];
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
        transfers_in_event: player.transfers_in_event,
        transfers_out_event: player.transfers_out_event,
        element_type: {
          singular_name_short: player.element_type.singular_name_short,
        },
        team: {
          id: player.team.id,
          short_name: player.team.short_name,
        },
        linked_data: {
          understat_id: playerStats?.id || null,
          past_matches:
            pastMatches?.map((m) => {
              const isHome = m.h_team === playerTeam;
              const opponent = isHome
                ? understatTeamsMap[m.a_team]
                : understatTeamsMap[m.h_team];
              const fplOpponentId = Object.keys(teamsLinks).find(
                (key) => teamsLinks[key] === opponent?.id
              );
              return {
                opponent_short_title:
                  fplTeamsMap[+fplOpponentId]?.short_name || null,
                is_home: isHome,
                match_xgi: +m.xA + +m.xG,
                match_xga: +playerTeamUnderstat?.datesData.find(
                  (d) => m.id === d.id
                )?.xG?.[isHome ? "a" : "h"],
              };
            }) || null,
          season_xgi:
            playerStats &&
            ((+playerStats.xA + +playerStats.xG) * 90) / +playerStats.time,
          season_xga:
            playerStats &&
            playerTeamUnderstat?.history.reduce((x, m) => +m.xGA + x, 0) /
              playerTeamUnderstat?.history.length,
          teamcolorcodes: teamcolorcodesMap[player.team.name] || null,
          transfers_delta_event:
            player.transfers_in_event - player.transfers_out_event,
          previous_gameweeks: player.history
            .filter((h) => !nextGameweekIds.includes(h.round)) // Only show the game the already played
            .slice(-5)
            .map((h) => ({
              opponent_team_short_name: fplTeamsMap[h.opponent_team].short_name,
              was_home: h.was_home,
              kickoff_time: h.kickoff_time,
              total_points: h.total_points,
              bps: h.bps,
              minutes: h.minutes,
            })),
          next_gameweeks: player.fixtures
            .filter((f) => nextGameweekIds.includes(f.event))
            .map((f) => ({
              opponent_team_short_name: f.is_home
                ? fplTeamsMap[f.team_a].short_name
                : fplTeamsMap[f.team_h].short_name,
              is_home: f.is_home,
              event: f.event,
              finished: f.finished,
              difficulty: f.difficulty,
            })),
        },
      };
    });

  return {
    players,
    gameweeks,
  };
};
