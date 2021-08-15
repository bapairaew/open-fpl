import {
  AppEntryEventPick,
  AppFixture,
  AppLive,
} from "@open-fpl/app/features/Api/apiTypes";
import { FixturePlayerStat } from "@open-fpl/app/features/Dashboard/dashboardTypes";
import { Player } from "@open-fpl/data/features/AppData/playerDataTypes";
import { Team } from "@open-fpl/data/features/AppData/teamDataTypes";

const sortPlayerStats = (a: FixturePlayerStat, b: FixturePlayerStat) => {
  if (
    (a.stats.picked && b.stats.picked) ||
    (!a.stats.picked && !b.stats.picked)
  ) {
    return a.stats.bps > b.stats.bps ? -1 : a.stats.bps === b.stats.bps ? 1 : 0;
  }
  return a.stats.picked ? -1 : 1;
};

export const getStatsFromLive = (
  live: AppLive,
  players: Player[],
  currentPicks: AppEntryEventPick[] | undefined,
  home: Team | undefined,
  away: Team | undefined
): {
  homePlayersStat: FixturePlayerStat[];
  awayPlayersStat: FixturePlayerStat[];
} => {
  const homePlayersStat: FixturePlayerStat[] = [];
  const awayPlayersStat: FixturePlayerStat[] = [];

  for (const element of live?.elements ?? []) {
    const player = players.find((p) => p.id === element.id)!;
    const liveStat = live.elements.find((e) => e.id === element.id);
    const stats = {
      picked: currentPicks?.some((p) => p.element === element.id) ?? false,
      bps: liveStat?.bps ?? 0,
      goals_scored: liveStat?.goals_scored ?? 0,
      assists: liveStat?.assists ?? 0,
      yellow_cards: liveStat?.yellow_cards ?? 0,
      red_cards: liveStat?.red_cards ?? 0,
      bonus: liveStat?.bonus ?? 0,
      total_points: liveStat?.total_points ?? 0,
      minutes: liveStat?.minutes ?? 0,
    };

    if (player.team.id === home?.id) {
      homePlayersStat.push({
        player,
        stats,
      });
    } else if (player.team.id === away?.id) {
      awayPlayersStat.push({
        player,
        stats,
      });
    }
  }

  return {
    homePlayersStat: homePlayersStat.sort(sortPlayerStats),
    awayPlayersStat: awayPlayersStat.sort(sortPlayerStats),
  };
};

export const getHomeAwayPicks = (
  fixture: AppFixture,
  players: Player[],
  currentPicks?: AppEntryEventPick[]
) => {
  const homeTeamPicks: AppEntryEventPick[] =
    currentPicks?.filter(
      (p) =>
        players.find((pl) => pl.id === p.element)?.team.id === fixture.team_h
    ) ?? [];

  const awayTeamPicks: AppEntryEventPick[] =
    currentPicks?.filter(
      (p) =>
        players.find((pl) => pl.id === p.element)?.team.id === fixture.team_a
    ) ?? [];

  return { homeTeamPicks, awayTeamPicks };
};
