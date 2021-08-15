import {
  AppData,
  TeamFixtures,
} from "@open-fpl/data/features/AppData/appDataTypes";
import {
  FPLElement,
  MatchStat,
  Player,
} from "@open-fpl/data/features/AppData/playerDataTypes";
import {
  ElementTypes,
  Team,
} from "@open-fpl/data/features/RemoteData/fplTypes";
import { RemoteData } from "@open-fpl/data/features/RemoteData/remoteDataTypes";
import {
  MatchData,
  TeamStat,
} from "@open-fpl/data/features/RemoteData/understatTypes";

const { UNDERSTAT_SEASON: _understatSeason } = process.env;
const understatSeason = _understatSeason ?? "2021";

export const makeTeamFixtures = ({
  fplElements,
  fplTeams,
}: {
  fplElements: FPLElement[];
  fplTeams: Team[];
}): TeamFixtures[] => {
  const teamFixtures = [] as TeamFixtures[];

  for (const fplTeam of fplTeams) {
    const fplElement = fplElements.find((f) => f.team === fplTeam.id);
    if (fplElement) {
      const { team, fixtures, history } = fplElement;
      teamFixtures.push({
        id: team,
        history,
        fixtures,
      });
    }
  }

  return teamFixtures;
};

export const makeAppData = ({
  fpl,
  understat,
  fplTeams,
  fplElementTypes,
  understatTeams,
  fplGameweeks,
  playersLinks,
  teamsLinks,
}: RemoteData & {
  playersLinks: Record<string, string>;
  teamsLinks: Record<string, string>;
}): AppData => {
  const gameweeks = fplGameweeks
    .filter((g) => !g.finished && !g.is_current)
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
  }, {} as Record<number, Team>);
  const fplElementTypesMap = fplElementTypes.reduce((fplElementTypesMap, t) => {
    fplElementTypesMap[t.id] = t;
    return fplElementTypesMap;
  }, {} as Record<number, ElementTypes>);
  const understatTeamsMap = understatTeams.reduce((understatTeamsMap, t) => {
    understatTeamsMap[t.title] = t;
    return understatTeamsMap;
  }, {} as Record<string, TeamStat>);

  const players = fpl.map((player) => {
    const playerUnderstat = playersLinks[player.id]
      ? understat.find((p) => p.id === playersLinks[player.id]) || null
      : null;
    const pastMatches =
      playerUnderstat?.matchesData
        .filter((m) => m.season === understatSeason)
        .slice(0, 5)
        .reverse() || null;
    // TODO: handle the case where a player moved mid-season to another PL team
    const latestPlayerEPLTeam = playerUnderstat?.groupsData?.season.find(
      (s) => understatTeamsMap[s.team]
    );
    const playerUnderstatTeam = latestPlayerEPLTeam
      ? understatTeamsMap[latestPlayerEPLTeam.team]
      : null;
    const fplPlayerTeam = fplTeamsMap[player.team];

    const mapPastMaches = (m: MatchData): MatchStat => {
      const isHome = m.h_team === playerUnderstatTeam!.title;
      const opponent = isHome
        ? understatTeamsMap[m.a_team]
        : understatTeamsMap[m.h_team];
      const fplOpponentId = Object.keys(teamsLinks).find(
        (key) => teamsLinks[key] === opponent?.id
      );
      const xga =
        playerUnderstatTeam!.datesData.find((d) => m.id === d.id)?.xG?.[
          isHome ? "a" : "h"
        ] || null;
      return {
        opponent_short_title: fplOpponentId
          ? fplTeamsMap[+fplOpponentId]?.short_name
          : null,
        is_home: isHome,
        match_time: +m.time,
        match_g: +m.goals,
        match_a: +m.assists,
        match_shots: +m.shots,
        match_key_passes: +m.key_passes,
        match_xg: +m.xG,
        match_xa: +m.xA,
        match_xgi: +m.xG + +m.xA,
        match_xga: xga ? +xga : null,
      };
    };

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
      selected_by_percent: player.selected_by_percent,
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
          playerUnderstatTeam && pastMatches
            ? pastMatches?.map(mapPastMaches)
            : null,
        season_time: playerUnderstat && +playerUnderstat.time,
        season_game: playerUnderstat && +playerUnderstat.games,
        season_g: playerUnderstat && +playerUnderstat.goals,
        season_a: playerUnderstat && +playerUnderstat.assists,
        season_shots: playerUnderstat && +playerUnderstat.shots,
        season_key_passes: playerUnderstat && +playerUnderstat.key_passes,
        season_xg: playerUnderstat && +playerUnderstat.xG,
        season_xa: playerUnderstat && +playerUnderstat.xA,
        season_xgi:
          playerUnderstat && +playerUnderstat.xG + +playerUnderstat.xA,
        season_xga:
          playerUnderstat &&
          playerUnderstatTeam &&
          playerUnderstatTeam.history.reduce((x, m) => +m.xGA + x, 0),
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
      },
    } as Player;
  });

  const fixtures = makeTeamFixtures({ fplElements: fpl, fplTeams });

  return {
    players,
    fixtures,
  };
};
