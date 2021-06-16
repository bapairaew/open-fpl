import { AppData, Player, FPLElement } from "~/features/AppData/appDataTypes";
import { ElementTypes, Event, Team } from "~/features/AppData/fplTypes";
import { TeamColorCodes } from "~/features/AppData/teamcolorcodesTypes";
import { PlayerStat, TeamStat } from "~/features/AppData/understatTypes";

export const makeAppData = ({
  fpl,
  understat,
  fplTeams,
  fplElementTypes,
  understatTeams,
  playersLinks,
  teamsLinks,
  fplGameweeks,
  teamcolorcodes,
}: {
  fpl: FPLElement[];
  understat: PlayerStat[];
  fplTeams: Team[];
  fplElementTypes: ElementTypes[];
  understatTeams: TeamStat[];
  playersLinks: Record<string, string>;
  teamsLinks: Record<string, string>;
  fplGameweeks: Event[];
  teamcolorcodes: TeamColorCodes[];
}): AppData => {
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

  const fplTeamsMap: Record<number, Team> = fplTeams.reduce(
    (fplTeamsMap, t) => {
      fplTeamsMap[t.id] = t;
      return fplTeamsMap;
    },
    {}
  );
  const fplElementTypesMap: Record<number, ElementTypes> =
    fplElementTypes.reduce((fplElementTypesMap, t) => {
      fplElementTypesMap[t.id] = t;
      return fplElementTypesMap;
    }, {});
  const understatTeamsMap: Record<string, TeamStat> = understatTeams.reduce(
    (understatTeamsMap, t) => {
      understatTeamsMap[t.title] = t;
      return understatTeamsMap;
    },
    {}
  );
  const teamcolorcodesMap: Record<string, TeamColorCodes> =
    teamcolorcodes.reduce((teamcolorcodesMap, code) => {
      teamcolorcodesMap[code.team] = code;
      return teamcolorcodesMap;
    }, {});

  const players: Player[] = fpl.map((player) => {
    const playerUnderstat = playersLinks[player.id]
      ? understat.find((p) => p.id === playersLinks[player.id]) || null
      : null;
    const pastMatches =
      playerUnderstat?.matchesData.slice(0, 5).reverse() || null;
    // TODO: handle the case where a player moved mid-season to another PL team
    const latestPlayerEPLTeam = playerUnderstat?.groupsData?.season.find(
      (s) => understatTeamsMap[s.team]
    );
    const playerUnderstatTeam = latestPlayerEPLTeam
      ? understatTeamsMap[latestPlayerEPLTeam.team]
      : null;
    const fplPlayerTeam = fplTeamsMap[player.team];
    return {
      id: player.id,
      first_name: player.first_name,
      second_name: player.second_name,
      web_name: player.web_name,
      news: player.news,
      status: player.status,
      cost_change_start: player.cost_change_start,
      now_cost: player.now_cost,
      photo: player.photo,
      chance_of_playing_next_round: player.chance_of_playing_next_round,
      chance_of_playing_this_round: player.chance_of_playing_this_round,
      total_points: player.total_points,
      transfers_in_event: player.transfers_in_event,
      transfers_out_event: player.transfers_out_event,
      element_type: {
        singular_name_short:
          fplElementTypesMap[player.element_type].singular_name_short,
      },
      team: {
        id: fplPlayerTeam.id,
        short_name: fplPlayerTeam.short_name,
      },
      linked_data: {
        understat_id: playerUnderstat?.id || null,
        past_matches:
          pastMatches?.map((m) => {
            const isHome = m.h_team === playerUnderstatTeam.id;
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
              match_xga: +playerUnderstatTeam?.datesData.find(
                (d) => m.id === d.id
              )?.xG?.[isHome ? "a" : "h"],
            };
          }) || null,
        season_xgi:
          playerUnderstat &&
          ((+playerUnderstat.xA + +playerUnderstat.xG) * 90) /
            +playerUnderstat.time,
        season_xga:
          playerUnderstat &&
          playerUnderstatTeam?.history.reduce((x, m) => +m.xGA + x, 0) /
            playerUnderstatTeam?.history.length,
        teamcolorcodes: teamcolorcodesMap[fplPlayerTeam.name] || null,
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
