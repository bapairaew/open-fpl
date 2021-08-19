import { ApiEntryEventPick } from "@open-fpl/app/features/Api/apiTypes";
import {
  DashboardFixture,
  FixturePlayerStat,
  RemoteDashboardFixture,
  RemoteFixturePlayerStats,
} from "@open-fpl/app/features/Dashboard/dashboardTypes";
import { ClientPlayer } from "@open-fpl/app/features/PlayerData/playerDataTypes";
import { Player } from "@open-fpl/data/features/AppData/playerDataTypes";
import { Team } from "@open-fpl/data/features/AppData/teamDataTypes";
import { Fixture, Live } from "@open-fpl/data/features/RemoteData/fplTypes";

const sortPlayerStats = (a: FixturePlayerStat, b: FixturePlayerStat) => {
  if ((a.picked && b.picked) || (!a.picked && !b.picked)) {
    return (a.stats?.bps ?? 0) > (b.stats?.bps ?? 0)
      ? -1
      : a.stats?.bps === b.stats?.bps
      ? 1
      : 0;
  }
  return a.picked ? -1 : 1;
};

export const getServerPlayersStats = (
  live: Live,
  fixture: Fixture,
  players: Player[]
): RemoteFixturePlayerStats[] => {
  const all: RemoteFixturePlayerStats[] = [];
  let bonusAvailable = false;

  live.elements.forEach((e) => {
    const player = players.find((p) => p.id === e.id);

    if (player) {
      const explain = e.explain.find((e) => e.fixture === fixture.id);
      const bpsHome = fixture.stats
        .find((s) => s.identifier === "bps")
        ?.h.find((e) => e.element === player?.id)?.value;
      const bpsAway = fixture.stats
        .find((s) => s.identifier === "bps")
        ?.a.find((e) => e.element === player?.id)?.value;
      const bps = bpsHome ?? bpsAway;

      const bonusHome = fixture.stats
        .find((s) => s.identifier === "bonus")
        ?.h.find((e) => e.element === player?.id)?.value;
      const bonusAway = fixture.stats
        .find((s) => s.identifier === "bonus")
        ?.a.find((e) => e.element === player?.id)?.value;
      const bonus = bonusHome ?? bonusAway;

      const stats = {
        goals_scored:
          explain?.stats.find((s) => s.identifier === "goals_scored")?.value ??
          0,
        assists:
          explain?.stats.find((s) => s.identifier === "assists")?.value ?? 0,
        yellow_cards:
          explain?.stats.find((s) => s.identifier === "yellow_cards")?.value ??
          0,
        red_cards:
          explain?.stats.find((s) => s.identifier === "red_cards")?.value ?? 0,
        bps: bps ?? 0,
        bonus: bonus ?? 0,
        total_points: explain?.stats.reduce((sum, s) => sum + s.points, 0) ?? 0,
        minutes:
          explain?.stats.find((s) => s.identifier === "minutes")?.value ?? 0,
      };

      const playerStats: RemoteFixturePlayerStats = {
        id: player.id,
        stats,
      };

      if (!bonusAvailable) {
        if (typeof bonus === "number" && bonus > 0) {
          bonusAvailable = true;
        }
      }

      all.push(playerStats);
    }
  });

  if (!bonusAvailable) {
    const [first, second, third] = [
      // @ts-ignore
      ...new Set(all.map((e) => e.stats.bps)),
    ].sort((a, b) => (a > b ? -1 : a < b ? 1 : 0));

    all.forEach((e) => {
      if (e.stats!.bps === first) {
        e.stats!.bonus = 3;
      } else if (e.stats!.bps === second) {
        e.stats!.bonus = 2;
      } else if (e.stats!.bps === third) {
        e.stats!.bonus = 1;
      }
    });
  }

  return all;
};

export const getServerDashboardFixture = (
  fixture: Fixture,
  stats?: RemoteFixturePlayerStats[] | null
) => {
  return {
    id: fixture.id,
    event: fixture.event,
    finished: fixture.finished,
    finished_provisional: fixture.finished_provisional,
    kickoff_time: fixture.kickoff_time,
    minutes: fixture.minutes,
    started: fixture.started,
    team_a: fixture.team_a,
    team_a_score: fixture.team_a_score,
    team_h: fixture.team_h,
    team_h_score: fixture.team_h_score,
    stats: stats ?? null,
  } as RemoteDashboardFixture;
};

export const dehydrateDashboardFixtures = (
  remoteCurrentGameweekFixtures: RemoteDashboardFixture[] | null,
  remoteNextGameweekFixtures: RemoteDashboardFixture[],
  players: ClientPlayer[],
  teams: Team[],
  currentPicks?: ApiEntryEventPick[] | null
): {
  currentGameweekFixtures: DashboardFixture[];
  nextGameweekFixtures: DashboardFixture[];
} => {
  const currentGameweekFixtures: DashboardFixture[] = [];
  remoteCurrentGameweekFixtures?.forEach((fixture) => {
    const dashboardFixture = {
      id: fixture.id,
      event: fixture.event,
      finished: fixture.finished,
      finished_provisional: fixture.finished_provisional,
      kickoff_time: fixture.kickoff_time,
      minutes: fixture.minutes,
      started: fixture.started,
      live: fixture.started && !fixture.finished_provisional,
      team_a: teams.find((t) => t.id === fixture.team_a),
      team_a_score: fixture.team_a_score,
      team_h: teams.find((t) => t.id === fixture.team_h),
      team_h_score: fixture.team_h_score,
      team_a_players: players
        .filter((p) => p.team.id === fixture.team_a)
        .map((player) => {
          const picked = currentPicks?.find(
            (p) => p.element === player.id && p.position <= 11
          );
          return {
            player,
            picked: !!picked,
            multiplier: picked?.multiplier ?? 0,
            live: fixture.started && !fixture.finished_provisional,
            opponent: teams.find((t) => t.id === fixture.team_h),
            fixture: dashboardFixture,
            stats:
              fixture.stats?.find((s) => s.id === player.id)?.stats ?? null,
          } as FixturePlayerStat;
        })
        .sort(sortPlayerStats),
      team_h_players: players
        .filter((p) => p.team.id === fixture.team_h)
        .map((player) => {
          const picked = currentPicks?.find(
            (p) => p.element === player.id && p.position <= 11
          );
          return {
            player,
            picked: !!picked,
            multiplier: picked?.multiplier ?? 0,
            live: fixture.started && !fixture.finished_provisional,
            opponent: teams.find((t) => t.id === fixture.team_a),
            stats:
              fixture.stats?.find((s) => s.id === player.id)?.stats ?? null,
          } as FixturePlayerStat;
        })
        .sort(sortPlayerStats),
    } as DashboardFixture;
    dashboardFixture.team_a_players.forEach((e) => {
      e.fixture = dashboardFixture;
    });
    dashboardFixture.team_h_players.forEach((e) => {
      e.fixture = dashboardFixture;
    });
    currentGameweekFixtures.push(dashboardFixture);
  });

  const nextGameweekFixtures: DashboardFixture[] = [];
  remoteNextGameweekFixtures.forEach((fixture) => {
    const dashboardFixture = {
      id: fixture.id,
      event: fixture.event,
      finished: fixture.finished,
      finished_provisional: fixture.finished_provisional,
      kickoff_time: fixture.kickoff_time,
      minutes: fixture.minutes,
      started: fixture.started,
      live: fixture.started && !fixture.finished_provisional,
      team_a: teams.find((t) => t.id === fixture.team_a),
      team_a_score: fixture.team_a_score,
      team_h: teams.find((t) => t.id === fixture.team_h),
      team_h_score: fixture.team_h_score,
      team_a_players: players
        .filter((p) => p.team.id === fixture.team_a)
        .map((player) => {
          const picked = currentPicks?.find(
            (p) => p.element === player.id && p.position <= 11
          );
          return {
            player,
            picked: !!picked,
            multiplier: picked?.multiplier ?? 0,
            opponent: teams.find((t) => t.id === fixture.team_h),
            fixture: dashboardFixture,
            stats: null,
          } as FixturePlayerStat;
        }),
      team_h_players: players
        .filter((p) => p.team.id === fixture.team_h)
        .map((player) => {
          const picked = currentPicks?.find(
            (p) => p.element === player.id && p.position <= 11
          );
          return {
            player,
            picked: !!picked,
            multiplier: picked?.multiplier ?? 0,
            opponent: teams.find((t) => t.id === fixture.team_a),
            fixture: dashboardFixture,
            stats: null,
          } as FixturePlayerStat;
        }),
    } as DashboardFixture;
    dashboardFixture.team_a_players.forEach((e) => {
      e.fixture = dashboardFixture;
    });
    dashboardFixture.team_h_players.forEach((e) => {
      e.fixture = dashboardFixture;
    });
    nextGameweekFixtures.push(dashboardFixture as DashboardFixture);
  });

  return { currentGameweekFixtures, nextGameweekFixtures };
};
