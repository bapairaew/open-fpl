import { CustomPlayer } from "@open-fpl/app/features/CustomPlayer/customPlayerTypes";
import { ClientPlayer } from "@open-fpl/app/features/PlayerData/playerDataTypes";
import { ElementStatus } from "@open-fpl/data/features/RemoteData/fplTypes";

// This works under the assumption that FPL id will not go beyond 10,000
export const generateCustomPlayerId = () =>
  Math.ceil(10000 + Math.random() * 100000);

export const hydrateCustomPlayer = (
  player: CustomPlayer,
  starred_index: number,
  // Required for hydrating dynamic data e.g. next fixtures data, and other static data e.g. colorcodes
  templatePlayer?: ClientPlayer
): ClientPlayer => {
  return {
    id: player.id,
    first_name: "",
    second_name: "",
    web_name: player.web_name,
    news: "",
    status: ElementStatus.AVAILABLE,
    now_cost: player.now_cost,
    cost_change_start: 0,
    total_points: 0,
    selected_by_percent: "0",
    cost_change_event: 0,
    transfers_out_event: 0,
    transfers_in_event: 0,
    element_type: {
      singular_name_short: player.element_type.singular_name_short,
    },
    team: templatePlayer?.team ?? {
      id: -1,
      short_name: player.team.short_name,
    },
    linked_data: {
      understat_id: null,
      past_matches: null,
      season_time: null,
      season_game: null,
      season_g: null,
      season_a: null,
      season_key_passes: null,
      season_shots: null,
      season_ga: null,
      season_xg: null,
      season_xa: null,
      season_xgi: null,
      season_xga: null,
      previous_gameweeks: null,
    },
    client_data: {
      starred_index,
      is_custom_player: true,
      gameweeks: templatePlayer?.client_data.gameweeks ?? null,
    },
  };
};
