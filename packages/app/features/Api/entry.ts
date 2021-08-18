import {
  ApiEntry,
  ApiEntryEventPick,
} from "@open-fpl/app/features/Api/apiTypes";
import {
  getEntry as _getEntry,
  getEntryPicks as _getEntryPicks,
} from "@open-fpl/data/features/RemoteData/fpl";

export const getEntry = async (id: number): Promise<ApiEntry> => {
  const {
    name,
    summary_overall_points,
    summary_event_points,
    summary_overall_rank,
  } = await _getEntry(id);
  return {
    name,
    summary_overall_points,
    summary_event_points,
    summary_overall_rank,
  };
};

export const getEntryPicks = async (
  id: number,
  event: number
): Promise<ApiEntryEventPick[]> => {
  const picks = (await _getEntryPicks(+id, +event)).picks.map((pick) => ({
    element: pick.element,
    multiplier: pick.multiplier,
    position: pick.position,
  }));
  return picks;
};
