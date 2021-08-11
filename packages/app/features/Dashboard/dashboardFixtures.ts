import {
  AppEntryEventPick,
  AppLive,
} from "@open-fpl/app/features/Api/apiTypes";
import { FixturePlayerStat } from "@open-fpl/app/features/Dashboard/dashboardTypes";
import { Player } from "@open-fpl/data/features/AppData/playerDataTypes";
import {
  Fixture,
  FixtureStat,
} from "@open-fpl/data/features/RemoteData/fplTypes";

export const geStatsFromFixture = (
  stats: FixtureStat[],
  players: Player[],
  currentPicks?: AppEntryEventPick[]
): {
  homePlayersStat: FixturePlayerStat[];
  awayPlayersStat: FixturePlayerStat[];
} => {
  const bpsStat = stats.find((s) => s.identifier === "bps");
  const goalsStat = stats.find((s) => s.identifier === "goals_scored");
  const assistsStat = stats.find((s) => s.identifier === "assists");
  const yellowCardsStat = stats.find((s) => s.identifier === "yellow_cards");
  const redCardsStat = stats.find((s) => s.identifier === "red_cards");
  const bonusStat = stats.find((s) => s.identifier === "bonus");

  if (!bpsStat)
    return {
      homePlayersStat: [],
      awayPlayersStat: [],
    };

  // const sortedBps = [...bpsStat.a, ...bpsStat.h]
  //   .map((s) => s.value)
  //   .sort((a, b) => (a > b ? -1 : a === b ? 1 : 0));
  // // @ts-ignore
  // const rankedBps = [...new Set(sortedBps)];

  const homePlayersStat: FixturePlayerStat[] = bpsStat.h
    .sort((a, b) => (a.value > b.value ? -1 : a.value === b.value ? 1 : 0))
    .map((s) => {
      const player = players.find((p) => p.id === s.element)!;
      return {
        player,
        stats: {
          picked: currentPicks?.some((p) => p.element === s.element) ?? false,
          bps: s.value,
          goals_scored:
            goalsStat?.h.find((gs) => gs.element === s.element)?.value ?? 0,
          assists:
            assistsStat?.h.find((gs) => gs.element === s.element)?.value ?? 0,
          yellow_cards:
            yellowCardsStat?.h.find((gs) => gs.element === s.element)?.value ??
            0,
          red_cards:
            redCardsStat?.h.find((gs) => gs.element === s.element)?.value ?? 0,
          bonus:
            bonusStat?.h.find((gs) => gs.element === s.element)?.value ?? 0,
          // rank: rankedBps.indexOf(s.value),
        },
      };
    });

  const awayPlayersStat: FixturePlayerStat[] = bpsStat.a
    .sort((a, b) => (a.value > b.value ? -1 : a.value === b.value ? 1 : 0))
    .map((s) => {
      const player = players.find((p) => p.id === s.element)!;
      return {
        player,
        stats: {
          picked: currentPicks?.some((p) => p.element === s.element) ?? false,
          bps: s.value,
          goals_scored:
            goalsStat?.a.find((gs) => gs.element === s.element)?.value ?? 0,
          assists:
            assistsStat?.a.find((gs) => gs.element === s.element)?.value ?? 0,
          yellow_cards:
            yellowCardsStat?.a.find((gs) => gs.element === s.element)?.value ??
            0,
          red_cards:
            redCardsStat?.a.find((gs) => gs.element === s.element)?.value ?? 0,
          bonus:
            bonusStat?.a.find((gs) => gs.element === s.element)?.value ?? 0,
          // rank: rankedBps.indexOf(s.value),
        },
      };
    });

  return {
    homePlayersStat,
    awayPlayersStat,
  };
};

export const getStatsFromLive = (
  live: AppLive,
  stats: FixtureStat[],
  players: Player[],
  currentPicks?: AppEntryEventPick[]
): {
  homePlayersStat: FixturePlayerStat[];
  awayPlayersStat: FixturePlayerStat[];
} => {
  const bpsStat = stats.find((s) => s.identifier === "bps");

  if (!bpsStat)
    return {
      homePlayersStat: [],
      awayPlayersStat: [],
    };

  const homePlayersStat: FixturePlayerStat[] = bpsStat.h
    .map((s) => {
      const player = players.find((p) => p.id === s.element)!;
      const liveStat = live.elements.find((e) => e.id === s.element);
      return {
        player,
        stats: {
          picked: currentPicks?.some((p) => p.element === s.element) ?? false,
          bps: liveStat?.bps ?? 0,
          goals_scored: liveStat?.goals_scored ?? 0,
          assists: liveStat?.assists ?? 0,
          yellow_cards: liveStat?.yellow_cards ?? 0,
          red_cards: liveStat?.red_cards ?? 0,
          bonus: liveStat?.bonus ?? 0,
        },
      };
    })
    .sort((a, b) =>
      a.stats.bps > b.stats.bps ? -1 : a.stats.bps === b.stats.bps ? 1 : 0
    );

  const awayPlayersStat: FixturePlayerStat[] = bpsStat.a
    .map((s) => {
      const player = players.find((p) => p.id === s.element)!;
      const liveStat = live.elements.find((e) => e.id === s.element);
      return {
        player,
        stats: {
          picked: currentPicks?.some((p) => p.element === s.element) ?? false,
          bps: liveStat?.bps ?? 0,
          goals_scored: liveStat?.goals_scored ?? 0,
          assists: liveStat?.assists ?? 0,
          yellow_cards: liveStat?.yellow_cards ?? 0,
          red_cards: liveStat?.red_cards ?? 0,
          bonus: liveStat?.bonus ?? 0,
        },
      };
    })
    .sort((a, b) =>
      a.stats.bps > b.stats.bps ? -1 : a.stats.bps === b.stats.bps ? 1 : 0
    );

  return {
    homePlayersStat,
    awayPlayersStat,
  };
};

export const getHomeAwayPicks = (
  fixture: Fixture,
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

// export const getPlayerPointsFromFixture = (
//   stats: FixtureStat[],
//   players: Player[],
//   currentPicks?: AppEntryEventPick[]
// ) => {
//   const { homePlayersStat, awayPlayersStat } = geStatsFromFixture(
//     stats,
//     players,
//     currentPicks
//   );

//   // TODO: calculate points
//   return [...homePlayersStat, ...awayPlayersStat].sort((a, b) =>
//     a.stats.bps > b.stats.bps ? -1 : a.stats.bps === b.stats.bps ? 1 : 0
//   );
// };
