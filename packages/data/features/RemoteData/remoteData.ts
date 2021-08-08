import { FPLElement } from "@open-fpl/data/features/AppData/playerDataTypes";
import {
  getFPLData,
  getFPLPlayerSummaryData,
} from "@open-fpl/data/features/RemoteData/fpl";
import { Element } from "@open-fpl/data/features/RemoteData/fplTypes";
import {
  RemoteData,
  FetchDataConfig,
} from "@open-fpl/data/features/RemoteData/remoteDataTypes";
import {
  getUnderstatData,
  getUnderstatPlayerData,
  getUnderstatPlayers,
  getUnderstatTeamData,
} from "@open-fpl/data/features/RemoteData/understat";
import {
  LeagueTeamStat,
  PlayerStat,
  PlayerStatSummary,
  TeamStat,
} from "@open-fpl/data/features/RemoteData/understatTypes";
import pRetry from "p-retry";
// @ts-ignore
import asyncPool from "tiny-async-pool";

function wait(t: number) {
  return new Promise(function (resolve) {
    setTimeout(resolve.bind(null), t);
  });
}

export async function fetchData(config: FetchDataConfig): Promise<RemoteData> {
  const {
    saveFn,
    retries,
    concurrent,
    delay,
    getItemsToUpdate,
    onSnapShotLoaded,
  } = config;
  const [fplData, underStatData, understatPlayersResponse] = await Promise.all([
    getFPLData(),
    getUnderstatData(),
    getUnderstatPlayers(),
  ]);

  await onSnapShotLoaded?.(fplData, underStatData, understatPlayersResponse);

  const {
    elements: fplPlayers,
    teams: fplTeams,
    element_types: fplElementTypes,
    events: fplGameweeks,
  } = fplData;

  const {
    response: { players: understatPlayers },
  } = understatPlayersResponse;

  const { teamsData } = underStatData;

  const fpl: FPLElement[] = [];
  const understat: PlayerStat[] = [];
  const understatTeams: TeamStat[] = [];

  await Promise.all([
    saveFn?.fpl_teams?.(fplTeams),
    saveFn?.fpl_element_types?.(fplElementTypes),
    saveFn?.fpl_gameweeks?.(fplGameweeks),
    asyncPool(
      concurrent?.fpl || 1,
      getItemsToUpdate?.fpl ? getItemsToUpdate.fpl(fplPlayers) : fplPlayers,
      (p: Element) =>
        pRetry(
          async () => {
            try {
              const summary = await getFPLPlayerSummaryData(p.id);
              const data = { ...p, ...summary };
              await saveFn?.fpl?.(data);
              fpl.push(data);
              delay?.fpl && (await wait(delay.fpl));
              return data;
            } catch (e) {
              throw e;
            }
          },
          { retries: retries?.fpl || 5 }
        )
    ),
    asyncPool(
      concurrent?.understat || 1,
      getItemsToUpdate?.understat
        ? getItemsToUpdate.understat(understatPlayers)
        : understatPlayers,
      (p: PlayerStatSummary) =>
        pRetry(
          async () => {
            try {
              const stats = await getUnderstatPlayerData(p.id);
              const data = { ...p, ...stats };
              await saveFn?.understat?.(data);
              understat.push(data);
              delay?.understat && (await wait(delay.understat));
              return data;
            } catch (e) {
              throw e;
            }
          },
          { retries: retries?.understat || 5 }
        )
    ),
    asyncPool(
      concurrent?.understat_teams || 1,
      getItemsToUpdate?.understat_teams
        ? getItemsToUpdate.understat_teams(Object.values(teamsData))
        : Object.values(teamsData),
      (p: LeagueTeamStat) =>
        pRetry(
          async () => {
            try {
              const stats = await getUnderstatTeamData(
                p.title.replace(/ /g, "_")
              );
              const data = { ...p, ...stats };
              await saveFn?.understat_teams?.(data);
              understatTeams.push(data);
              delay?.understat_teams && (await wait(delay.understat_teams));
              return data;
            } catch (e) {
              throw e;
            }
          },
          { retries: retries?.understat_teams || 5 }
        )
    ),
  ]);

  return {
    fpl,
    fplTeams,
    fplElementTypes,
    fplGameweeks,
    understat,
    understatTeams,
  };
}
