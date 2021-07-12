import { Player } from "~/features/AppData/appDataTypes";
import { ElementStatus } from "~/features/AppData/fplTypes";
import { FullChangePlayer } from "~/features/TransferPlanner/transferPlannerTypes";

export const getPositionFromPlaceholderPosition = (position: number) => {
  if (position === 1 || position === 12) {
    return "GKP";
  } else if (position <= 5 || position === 13) {
    return "DEF";
  } else if (position <= 9 || position === 14) {
    return "MID";
  } else if (position <= 11 || position === 15) {
    return "FWD";
  }
  return "";
};

export function makePlaceholderPlayerFromId(id: number): Player {
  const position = id * -1;
  const elementType = getPositionFromPlaceholderPosition(position);
  return {
    id,
    first_name: "",
    second_name: "",
    web_name: "Select a player",
    news: "",
    status: ElementStatus.AVAILABLE,
    now_cost: 0,
    photo: "",
    cost_change_start: 0,
    chance_of_playing_next_round: null,
    chance_of_playing_this_round: null,
    total_points: 0,
    selected_by_percent: "0",
    transfers_in_event: 0,
    transfers_out_event: 0,
    element_type: {
      singular_name_short: elementType,
    },
    team: {
      id,
      short_name: "",
    },
    linked_data: {
      transfers_delta_event: 0,
      understat_id: null,
      past_matches: null,
      season_time: null,
      season_game: null,
      season_g: null,
      season_a: null,
      season_key_passes: null,
      season_shots: null,
      season_xg: null,
      season_xa: null,
      season_xgi: null,
      season_xga: null,
      teamcolorcodes: {
        team: "",
        background: "#fff",
        text: "#000",
        highlight: "#000",
      },
      previous_gameweeks: null,
      next_gameweeks: null,
    },
    client_data: {
      starred_index: -1,
      is_custom_player: false,
    },
  };
}

export function makePlaceholderFullChangePlayerFromPosition(
  position: number
): FullChangePlayer {
  const id = -1 * position;
  const player = makePlaceholderPlayerFromId(id);
  return {
    isPlaceholder: true,
    ...player,
    pick: {
      element: id,
      position,
      now_cost: 0,
      selling_price: 0,
      purchase_price: 0,
      multiplier: 1,
      is_captain: false,
      is_vice_captain: false,
    },
  };
}
