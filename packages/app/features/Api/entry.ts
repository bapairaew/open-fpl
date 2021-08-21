import {
  ApiEntry,
  ApiEntryEventPick,
  ApiEntryHistory,
} from "@open-fpl/app/features/Api/apiTypes";
import {
  getEntry as _getEntry,
  getEntryHistory as _getEntryHistory,
  getEntryPicks as _getEntryPicks,
} from "@open-fpl/data/features/RemoteData/fpl";

export const getEntry = async (id: number): Promise<ApiEntry | string> => {
  const response = await _getEntry(id);
  if (typeof response === "string") {
    return response;
  } else {
    const {
      name,
      summary_overall_points,
      summary_event_points,
      summary_overall_rank,
    } = response;
    return {
      name,
      summary_overall_points,
      summary_event_points,
      summary_overall_rank,
    };
  }
};

export const getEntryHistory = async (
  id: number
): Promise<ApiEntryHistory | string> => {
  const response = await _getEntryHistory(id);
  if (typeof response === "string") {
    return response;
  } else {
    const current = response.current.map((c) => ({
      overall_rank: c.overall_rank,
      total_points: c.total_points,
    }));
    return { current };
  }
};

export const getEntryPicks = async (
  id: number,
  event: number
): Promise<ApiEntryEventPick[] | string> => {
  const response = await _getEntryPicks(+id, +event);
  if (typeof response === "string") {
    return response;
  } else {
    const picks = response.picks.map((pick) => ({
      element: pick.element,
      multiplier: pick.multiplier,
      position: pick.position,
    }));
    return picks;
  }
};
