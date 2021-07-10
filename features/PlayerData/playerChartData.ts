import { Player } from "~/features/AppData/appDataTypes";
import { PlayerChartData } from "~/features/PlayerData/playerChartTypes";

export const assumedMax = {
  recentG: 5,
  recentA: 5,
  recentShots: 35,
  recentKeyPasses: 30,
  recentXG: 4,
  recentXA: 4,
  recentXGA: 10,
  recentBPS: 3,
  seasonG: 25,
  seasonA: 25,
  seasonShots: 140,
  seasonKeyPasses: 120,
  seasonXG: 25,
  seasonXA: 25,
  seasonXGA: 70,
  seasonBPS: 280,
};

const getPercentage = (value: number | null, max: number) => {
  return Math.min(100, (100 * (value ?? 0)) / max);
};

export const getChartData = (player: Player): PlayerChartData => {
  const recentG =
    player.linked_data.past_matches &&
    player.linked_data.past_matches.length !== 0
      ? player.linked_data.past_matches.reduce(
          (s, m) => s + (m.match_g ?? 0),
          0
        )
      : null;

  const recentA =
    player.linked_data.past_matches &&
    player.linked_data.past_matches.length !== 0
      ? player.linked_data.past_matches.reduce(
          (s, m) => s + (m.match_a ?? 0),
          0
        )
      : null;

  const recentShots =
    player.linked_data.past_matches &&
    player.linked_data.past_matches.length !== 0
      ? player.linked_data.past_matches.reduce(
          (s, m) => s + (m.match_shots ?? 0),
          0
        )
      : null;

  const recentKeyPasses =
    player.linked_data.past_matches &&
    player.linked_data.past_matches.length !== 0
      ? player.linked_data.past_matches.reduce(
          (s, m) => s + (m.match_key_passes ?? 0),
          0
        )
      : null;

  const recentXG =
    player.linked_data.past_matches &&
    player.linked_data.past_matches.length !== 0
      ? player.linked_data.past_matches.reduce(
          (s, m) => s + (m.match_xg ?? 0),
          0
        )
      : null;

  const recentXA =
    player.linked_data.past_matches &&
    player.linked_data.past_matches.length !== 0
      ? player.linked_data.past_matches.reduce(
          (s, m) => s + (m.match_xa ?? 0),
          0
        )
      : null;

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
