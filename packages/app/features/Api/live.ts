import { AppLive } from "@open-fpl/app/features/Api/apiTypes";
import { getLiveEvent as _getLiveEvent } from "@open-fpl/data/features/RemoteData/fpl";
import { NextApiRequest } from "next";

export const getLiveEvent = async (req: NextApiRequest): Promise<AppLive> => {
  const id = typeof req.query.id === "string" ? req.query.id : req.query.id[0];
  const elements = (await _getLiveEvent(+id)).elements.map((data) => ({
    id: data.id,
    bps: data.stats.bps,
    goals_scored: data.stats.goals_scored,
    assists: data.stats.assists,
    yellow_cards: data.stats.yellow_cards,
    red_cards: data.stats.red_cards,
    bonus: data.stats.bonus,
  }));
  return { elements };
};
