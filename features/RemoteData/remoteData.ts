import pRetry from "p-retry";
// @ts-ignore
import asyncPool from "tiny-async-pool";
import { getFPLData, getFPLPlayerSummaryData } from "~/features/RemoteData/fpl";
import {
  getUnderstatData,
  getUnderstatPlayerData,
  getUnderstatPlayers,
  getUnderstatTeamData,
} from "~/features/RemoteData/understat";
import { Element } from "./fplTypes";
import { LeagueTeamStat, PlayerStatSummary } from "./understatTypes";

type FetchDataConfigOption = {
  fpl: number;
  understat: number;
  understat_teams: number;
};

type FetchDataConfig = {
  saveFn: (data: any, type: string) => Promise<any>;
  retries: FetchDataConfigOption;
  concurrent: FetchDataConfigOption;
  delay: FetchDataConfigOption;
};

function wait(t: number) {
  return new Promise(function (resolve) {
    setTimeout(resolve.bind(null), t);
  });
}

export async function fetchData(config: FetchDataConfig): Promise<any> {
  const { saveFn, retries, concurrent, delay } = config;
  const [
    {
      elements: fplPlayers,
      teams: fplTeams,
      element_types: fplElementTypes,
      events: fplGameWeeks,
    },
    {
      response: { players: understatPlayers },
    },
    { teamsData },
  ] = await Promise.all([
    await getFPLData(),
    await getUnderstatPlayers(),
    await getUnderstatData(),
  ]);

  return Promise.all([
    asyncPool(concurrent?.fpl || 1, fplPlayers, (p: Element) =>
      pRetry(
        async () => {
          try {
            const summary = await getFPLPlayerSummaryData(p.id);
            const data = { ...p, ...summary };
            await saveFn?.(data, "fpl");
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
      understatPlayers,
      (p: PlayerStatSummary) =>
        pRetry(
          async () => {
            try {
              const stats = await getUnderstatPlayerData(p.id);
              const data = { ...p, ...stats };
              await saveFn?.(data, "understat");
              delay?.understat && (await wait(delay.understat));
              return data;
            } catch (e) {
              throw e;
            }
          },
          { retries: retries?.understat || 5 }
        )
    ),
    saveFn?.(fplTeams, "fpl_teams"),
    saveFn?.(fplElementTypes, "fpl_element_types"),
    asyncPool(
      concurrent?.understat_teams || 1,
      Object.values(teamsData),
      (p: LeagueTeamStat) =>
        pRetry(
          async () => {
            try {
              p.id = p.title.replace(/ /g, "_"); // title is being used as reference instead of actual id in other dataset
              const stats = await getUnderstatTeamData(p.id);
              const data = { ...p, ...stats };
              await saveFn?.(data, "understat_teams");
              delay?.understat_teams && (await wait(delay.understat_teams));
              return data;
            } catch (e) {
              throw e;
            }
          },
          { retries: retries?.understat_teams || 5 }
        )
    ),
    saveFn?.(fplGameWeeks, "fpl_gameweeks"),
  ]);
}
