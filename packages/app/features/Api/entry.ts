import {
  AppEntry,
  AppEntryEventPick,
} from "@open-fpl/app/features/Api/apiTypes";
import {
  getEntry as _getEntry,
  getEntryPicks as _getEntryPicks,
} from "@open-fpl/data/features/RemoteData/fpl";

export const getEntry = async (id: number): Promise<AppEntry> => {
  const { name, summary_overall_points, summary_event_points } =
    await _getEntry(id);
  return { name, summary_overall_points, summary_event_points };
};

export const getEntryPicks = async (
  id: number,
  event: number
): Promise<AppEntryEventPick[]> => {
  const picks = (await _getEntryPicks(+id, +event)).picks.map((pick) => ({
    element: pick.element,
    multiplier: pick.multiplier,
    position: pick.position,
  }));
  return picks;
};
