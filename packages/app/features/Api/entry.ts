import { NextApiRequest } from "next";
import {
  AppEntry,
  AppEntryEventPick,
} from "@open-fpl/app/features/Api/apiTypes";
import {
  getEntry as _getEntry,
  getEntryPicks as _getEntryPicks,
} from "@open-fpl/data/features/RemoteData/fpl";

export const getEntry = async (req: NextApiRequest): Promise<AppEntry> => {
  const id = typeof req.query.id === "string" ? req.query.id : req.query.id[0];
  const { name, summary_overall_points, summary_event_points } =
    await _getEntry(+id);
  return { name, summary_overall_points, summary_event_points };
};

export const getEntryPicks = async (
  req: NextApiRequest
): Promise<AppEntryEventPick[]> => {
  const id = typeof req.query.id === "string" ? req.query.id : req.query.id[0];
  const event =
    typeof req.query.event === "string" ? req.query.event : req.query.event[0];
  const picks = (await _getEntryPicks(+id, +event)).picks.map((pick) => ({
    element: pick.element,
    multiplier: pick.multiplier,
  }));
  return picks;
};
