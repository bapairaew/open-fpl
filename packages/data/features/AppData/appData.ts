import { AppData } from "@open-fpl/data/features/AppData/appDataTypes";
import {
  TeamFixture,
  TeamFixtures,
} from "@open-fpl/data/features/AppData/fixtureDataTypes";
import {
  MatchStat,
  Player,
} from "@open-fpl/data/features/AppData/playerDataTypes";
import {
  Team,
  TeamMatchStat,
} from "@open-fpl/data/features/AppData/teamDataTypes";
import {
  ElementTypes,
  Fixture as FPLFixture,
  Team as FPLTeam,
} from "@open-fpl/data/features/RemoteData/fplTypes";
import { RemoteData } from "@open-fpl/data/features/RemoteData/remoteDataTypes";
import {
  MatchData,
  TeamStat,
} from "@open-fpl/data/features/RemoteData/understatTypes";

const { UNDERSTAT_SEASON: _understatSeason } = process.env;
const understatSeason = _understatSeason ?? "2021";

const makePlayers = ({
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
}): Player[] => {
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
  }, {} as Record<number, FPLTeam>);
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
      const matched = playerUnderstatTeam!.datesData.find((d) => m.id === d.id);
      const xga = matched?.xG?.[isHome ? "a" : "h"] || null;
      const ga = matched?.goals?.[isHome ? "a" : "h"] || null;
      return {
        opponent_id: fplOpponentId ? +fplOpponentId : null,
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
        match_ga: ga ? +ga : null,
        match_xga: xga ? +xga : null,
      };
    };

    // Our Understat script does not override the player's data from last season if they have not played the current season yet
    // Hence we override it at this level instead
    const hasPlayedThisSeason = (pastMatches?.length ?? 0) > 0;

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
      cost_change_event: player.cost_change_event,
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
        season_time: hasPlayedThisSeason
          ? playerUnderstat && +playerUnderstat.time
          : 0,
        season_game: hasPlayedThisSeason
          ? playerUnderstat && +playerUnderstat.games
          : 0,
        season_g: hasPlayedThisSeason
          ? playerUnderstat && +playerUnderstat.goals
          : 0,
        season_a: hasPlayedThisSeason
          ? playerUnderstat && +playerUnderstat.assists
          : 0,
        season_ga: hasPlayedThisSeason
          ? playerUnderstat &&
            playerUnderstatTeam &&
            playerUnderstatTeam.history.reduce((x, m) => +m.missed + x, 0)
          : 0,
        season_shots: hasPlayedThisSeason
          ? playerUnderstat && +playerUnderstat.shots
          : 0,
        season_key_passes: hasPlayedThisSeason
          ? playerUnderstat && +playerUnderstat.key_passes
          : 0,
        season_xg: hasPlayedThisSeason
          ? playerUnderstat && +playerUnderstat.xG
          : 0,
        season_xa: hasPlayedThisSeason
          ? playerUnderstat && +playerUnderstat.xA
          : 0,
        season_xgi: hasPlayedThisSeason
          ? playerUnderstat && +playerUnderstat.xG + +playerUnderstat.xA
          : 0,
        season_xga: hasPlayedThisSeason
          ? playerUnderstat &&
            playerUnderstatTeam &&
            playerUnderstatTeam.history.reduce((x, m) => +m.xGA + x, 0)
          : 0,
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

  return players;
};

const makeTeamFixtures = ({
  fplFixtures,
  fplTeams,
}: {
  fplFixtures: FPLFixture[];
  fplTeams: FPLTeam[];
}): TeamFixtures[] => {
  const teamFixtures = [] as TeamFixtures[];

  for (const fplTeam of fplTeams) {
    const matchedFPLFixtures = fplFixtures.filter(
      (f) => f.team_h === fplTeam.id || f.team_a === fplTeam.id
    );
    const fixtures: TeamFixture[] = [];

    for (const f of matchedFPLFixtures) {
      fixtures.push({
        opponent_team: f.team_h === fplTeam.id ? f.team_a : f.team_h,
        event: f.event,
        is_home: f.team_h === fplTeam.id,
        team_h_score: f.team_h_score,
        team_a_score: f.team_a_score,
        team_h_difficulty: f.team_h_difficulty,
        team_a_difficulty: f.team_a_difficulty,
        finished: f.finished,
      });
    }

    teamFixtures.push({
      id: fplTeam.id,
      fixtures,
    });
  }

  return teamFixtures;
};

const makeTeams = ({
  fplTeams,
  understatTeams,
  teamsLinks,
}: {
  fplTeams: FPLTeam[];
  understatTeams: TeamStat[];
  teamsLinks: Record<string, string>;
}): Team[] => {
  const teams: Team[] = [];

  for (const fplTeam of fplTeams) {
    const understatTeam = understatTeams.find(
      (u) => u.id === teamsLinks[fplTeam.id]
    );

    teams.push({
      id: fplTeam.id,
      name: fplTeam.name,
      short_name: fplTeam.short_name,
      strength_attack_home: fplTeam.strength_attack_home,
      strength_attack_away: fplTeam.strength_attack_away,
      strength_defence_home: fplTeam.strength_defence_home,
      strength_defence_away: fplTeam.strength_defence_away,
      form: fplTeam.form,
      stats: understatTeam
        ? {
            games: understatTeam.history.length,
            g: understatTeam.history.reduce((sum, h) => h.scored + sum, 0),
            xg: understatTeam.history.reduce((sum, h) => h.xG + sum, 0),
            ga: understatTeam.history.reduce((sum, h) => h.missed + sum, 0),
            xga: understatTeam.history.reduce((sum, h) => h.xGA + sum, 0),
            pts: understatTeam.history.reduce((sum, h) => h.pts + sum, 0),
            xpts: understatTeam.history.reduce((sum, h) => h.xpts + sum, 0),
            position: -1,
            xposition: -1,
            wins: understatTeam.history.reduce((sum, h) => h.wins + sum, 0),
            draws: understatTeam.history.reduce((sum, h) => h.draws + sum, 0),
            loses: understatTeam.history.reduce((sum, h) => h.loses + sum, 0),
            matches: understatTeam.history
              .slice(-5)
              .map((m) => {
                const matched = understatTeam.datesData.find(
                  (d) => d.datetime === m.date
                );
                if (matched) {
                  const opponentSide = matched.side === "a" ? "h" : "a";
                  const opponent = Object.entries(teamsLinks).find(
                    ([key, value]) => value === matched[opponentSide].id
                  )?.[0];
                  if (opponent) {
                    return {
                      opponent: +opponent,
                      id: matched.id,
                      g: m.scored,
                      xg: m.xG,
                      ga: m.missed,
                      xga: m.xGA,
                      pts: m.pts,
                      xpts: m.xpts,
                      result: m.result,
                    };
                  }
                }
                return null;
              })
              .filter((m) => m !== null) as TeamMatchStat[],
          }
        : null,
    });
  }

  const positions = [...teams].sort((a, b) => {
    if ((a.stats?.pts ?? 0) > (b.stats?.pts ?? 0)) {
      return -1;
    } else if ((a.stats?.pts ?? 0) < (b.stats?.pts ?? 0)) {
      return 1;
    } else if (
      (a.stats?.g ?? 0) - (a.stats?.ga ?? 0) >
      (b.stats?.g ?? 0) - (b.stats?.ga ?? 0)
    ) {
      return -1;
    } else if (
      (a.stats?.g ?? 0) - (a.stats?.ga ?? 0) <
      (b.stats?.g ?? 0) - (b.stats?.ga ?? 0)
    ) {
      return 1;
    } else if ((a.stats?.g ?? 0) > (b.stats?.g ?? 0)) {
      return -1;
    } else if ((a.stats?.g ?? 0) < (b.stats?.g ?? 0)) {
      return 1;
    }
    return 0;
  });

  const xpositions = [...teams].sort((a, b) => {
    if ((a.stats?.xpts ?? 0) > (b.stats?.xpts ?? 0)) {
      return -1;
    } else if ((a.stats?.xpts ?? 0) < (b.stats?.xpts ?? 0)) {
      return 1;
    } else if (
      (a.stats?.xg ?? 0) - (a.stats?.xga ?? 0) >
      (b.stats?.xg ?? 0) - (b.stats?.xga ?? 0)
    ) {
      return -1;
    } else if (
      (a.stats?.xg ?? 0) - (a.stats?.xga ?? 0) <
      (b.stats?.xg ?? 0) - (b.stats?.xga ?? 0)
    ) {
      return 1;
    } else if ((a.stats?.xg ?? 0) > (b.stats?.xg ?? 0)) {
      return -1;
    } else if ((a.stats?.xg ?? 0) < (b.stats?.xg ?? 0)) {
      return 1;
    }
    return 0;
  });

  for (const team of teams) {
    if (team.stats) {
      team.stats.position = positions.findIndex((t) => t.id === team.id) + 1;
      team.stats.xposition = xpositions.findIndex((t) => t.id === team.id) + 1;
    }
  }

  return teams;
};

export const makeAppData = ({
  fpl,
  understat,
  understatTeams,
  fplFixtures,
  fplTeams,
  fplElementTypes,
  fplGameweeks,
  playersLinks,
  teamsLinks,
}: RemoteData & {
  playersLinks: Record<string, string>;
  teamsLinks: Record<string, string>;
}): AppData => {
  const players = makePlayers({
    fpl,
    fplFixtures,
    fplTeams,
    fplElementTypes,
    understat,
    understatTeams,
    fplGameweeks,
    playersLinks,
    teamsLinks,
  });

  const fixtures = makeTeamFixtures({
    fplFixtures,
    fplTeams,
  });

  const teams = makeTeams({ fplTeams, understatTeams, teamsLinks });

  return {
    players,
    fixtures,
    teams,
  };
};
