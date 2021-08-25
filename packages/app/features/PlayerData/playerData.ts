import { hydrateCustomPlayer } from "@open-fpl/app/features/CustomPlayer/customPlayers";
import { CustomPlayer } from "@open-fpl/app/features/CustomPlayer/customPlayerTypes";
import { FullTeamFixtures } from "@open-fpl/app/features/Fixtures/fixturesDataTypes";
import {
  ClientData,
  ClientPlayer,
} from "@open-fpl/app/features/PlayerData/playerDataTypes";
import {
  MatchStat,
  Player,
  PlayerSummaryData,
} from "@open-fpl/data/features/AppData/playerDataTypes";

export const assumedMax = {
  g: 2,
  a: 2,
  shots: 7,
  keyPasses: 7,
  xg: 1,
  xa: 1,
  xgi: 2,
  xga: 1,
  recentG: 5,
  recentA: 5,
  recentShots: 35,
  recentKeyPasses: 30,
  recentXG: 5,
  recentXA: 5,
  recentXGA: 10,
  recentBPS: 150,
  seasonG: 25,
  seasonA: 25,
  seasonShots: 140,
  seasonKeyPasses: 120,
  seasonXG: 25,
  seasonXA: 25,
  seasonXGI: 50,
  seasonXGA: 70,
  seasonBPS: 280,
};

const getPercentage = (value: number | null, max: number) => {
  return Math.min(100, (100 * (value ?? 0)) / max);
};

export const getSummarytData = (player: Player): PlayerSummaryData => {
  const getDataFromPastMatches = (key: keyof MatchStat) => {
    return player.linked_data.past_matches &&
      player.linked_data.past_matches.length !== 0
      ? player.linked_data.past_matches.reduce(
          (s, m) => s + ((m[key] as number | null) ?? 0),
          0
        )
      : null;
  };

  const recentG = getDataFromPastMatches("match_g");
  const recentA = getDataFromPastMatches("match_a");
  const recentShots = getDataFromPastMatches("match_shots");
  const recentKeyPasses = getDataFromPastMatches("match_key_passes");
  const recentXG = getDataFromPastMatches("match_xg");
  const recentXA = getDataFromPastMatches("match_xa");

  const recentXGA =
    player.linked_data.past_matches &&
    player.linked_data.past_matches.length !== 0
      ? player.linked_data.past_matches.reduce(
          (s, m) => s + (m.match_xga ?? 0),
          0
        )
      : null;

  const recentBPS =
    player.linked_data.previous_gameweeks &&
    player.linked_data.previous_gameweeks.length !== 0
      ? player.linked_data.previous_gameweeks.reduce((s, m) => s + m.bps, 0)
      : null;

  return {
    recentG: getPercentage(recentG, assumedMax.recentG),
    recentA: getPercentage(recentA, assumedMax.recentA),
    recentShots: getPercentage(recentShots, assumedMax.recentShots),
    recentKeyPasses: getPercentage(recentKeyPasses, assumedMax.recentKeyPasses),
    recentXG: getPercentage(recentXG, assumedMax.recentXG),
    recentXA: getPercentage(recentXA, assumedMax.recentXA),
    recentXGA: getPercentage(recentXGA, assumedMax.recentXGA),
    recentBPS: getPercentage(recentBPS, assumedMax.recentBPS),
    seasonG: getPercentage(player.linked_data.season_g, assumedMax.seasonG),
    seasonA: getPercentage(player.linked_data.season_a, assumedMax.seasonA),
    seasonShots: getPercentage(
      player.linked_data.season_shots,
      assumedMax.seasonShots
    ),
    seasonKeyPasses: getPercentage(
      player.linked_data.season_key_passes,
      assumedMax.seasonKeyPasses
    ),
    seasonXG: getPercentage(player.linked_data.season_xg, assumedMax.seasonXG),
    seasonXA: getPercentage(player.linked_data.season_xa, assumedMax.seasonXA),
    seasonXGA: getPercentage(
      player.linked_data.season_xga,
      assumedMax.seasonXGA
    ),
    seasonBPS: getPercentage(player.total_points, assumedMax.seasonBPS),
  };
};

export const hydrateClientData = (
  players: Player[],
  starredPlayers: number[],
  customPlayers: CustomPlayer[],
  fullFixtures: FullTeamFixtures[]
): ClientPlayer[] => {
  const clientPlayers = players.map((player) => {
    const team = fullFixtures.find(
      (f) => f.short_name === player.team.short_name
    );
    return {
      ...player,
      client_data: {
        is_custom_player: false,
        starred_index: starredPlayers.indexOf(player.id),
        gameweeks: team?.gameweeks.map((fixtures) =>
          fixtures.map((fixture) => ({
            event: fixture.event,
            is_finished: fixture.is_finished,
            is_home: fixture.is_home,
            difficulty: ["FWD", "MID"].includes(
              player.element_type.singular_name_short
            )
              ? fixture.attack_difficulty
              : fixture.defence_difficulty,
            opponent: fixture.opponent,
          }))
        ),
      } as ClientData,
    } as ClientPlayer;
  });

  return [
    ...clientPlayers,
    ...customPlayers.map((customPlayer) => {
      const templatePlayer = clientPlayers.find(
        (p) => p.team.short_name === customPlayer.team.short_name
      );
      return hydrateCustomPlayer(
        customPlayer,
        starredPlayers.indexOf(customPlayer.id),
        templatePlayer
      );
    }),
  ];
};
