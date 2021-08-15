import { AppLive } from "@open-fpl/app/features/Api/apiTypes";
import { getLiveEvent as _getLiveEvent } from "@open-fpl/data/features/RemoteData/fpl";

export const getLiveEvent = async (
  event: number,
  fixtures: number[]
): Promise<AppLive> => {
  const allElements = (await _getLiveEvent(+event)).elements;
  const elements = allElements
    .filter(
      (p) =>
        p.explain.some((e) => fixtures.includes(e.fixture)) &&
        p.stats.minutes > 0
    )
    .map((data) => ({
      id: data.id,
      bps: data.stats.bps,
      goals_scored: data.stats.goals_scored,
      assists: data.stats.assists,
      yellow_cards: data.stats.yellow_cards,
      red_cards: data.stats.red_cards,
      bonus: data.stats.bonus,
      total_points: data.stats.total_points,
      minutes: data.stats.minutes,
    }));
  return { elements };
};
