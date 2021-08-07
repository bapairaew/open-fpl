import pRetry from "p-retry";
// @ts-ignore
import asyncPool from "tiny-async-pool";
import {
  getFPLData,
  getFPLPlayerSummaryData,
} from "@open-fpl/data/features/RemoteData/fpl";
import {
  Bootstrap,
  Element,
} from "@open-fpl/data/features/RemoteData/fplTypes";
import {
  getUnderstatData,
  getUnderstatPlayerData,
  getUnderstatPlayers,
  getUnderstatTeamData,
} from "@open-fpl/data/features/RemoteData/understat";
import {
  GetUnderstatPlayersResponse,
  LeagueTeamStat,
  PlayerStatSummary,
  LeagueStat,
} from "@open-fpl/data/features/RemoteData/understatTypes";

type FetchDataConfigOptions<T> = {
  fpl?: T;
  understat?: T;
  understat_teams?: T;
  fpl_teams?: T;
  fpl_element_types?: T;
  fpl_gameweeks?: T;
};

type GetItemToUpdateFunction = (list: any) => any[];

type OnSnapShotLoadedHandler = (
  fplData: Bootstrap,
  underStatData: LeagueStat,
  understatPlayersResponse: GetUnderstatPlayersResponse
) => Promise<any> | void;

type SaveItemFunction = (data: any) => Promise<any> | void;

type FetchDataConfig = {
  onSnapShotLoaded?: OnSnapShotLoadedHandler;
  saveFn: FetchDataConfigOptions<SaveItemFunction>;
  getItemsToUpdate?: FetchDataConfigOptions<GetItemToUpdateFunction>;
  retries?: FetchDataConfigOptions<number>;
  concurrent?: FetchDataConfigOptions<number>;
  delay?: FetchDataConfigOptions<number>;
};

function wait(t: number) {
  return new Promise(function (resolve) {
    setTimeout(resolve.bind(null), t);
  });
}

export async function fetchData(config: FetchDataConfig): Promise<any> {
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
    events: fplGameWeeks,
  } = fplData;

  const {
    response: { players: understatPlayers },
  } = understatPlayersResponse;

  const { teamsData } = underStatData;

  return Promise.all([
    saveFn?.fpl_teams?.(fplTeams),
    saveFn?.fpl_element_types?.(fplElementTypes),
    saveFn?.fpl_gameweeks?.(fplGameWeeks),
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
              p.id = p.title.replace(/ /g, "_"); // title is being used as reference instead of actual id in other dataset
              const stats = await getUnderstatTeamData(p.id);
              const data = { ...p, ...stats };
              await saveFn?.understat_teams?.(data);
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
}
