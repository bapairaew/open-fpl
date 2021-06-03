import pRetry from "p-retry";
import asyncPool from "tiny-async-pool";
import { getFPLData, getFPLPlayerSummaryData } from "./fpl";
import {
  getUnderstatPlayerData,
  getUnderstatPlayers,
  getUnderstatData,
  getUnderstatTeamData,
} from "./understat";

function wait(t, v) {
  return new Promise(function (resolve) {
    setTimeout(resolve.bind(null, v), t);
  });
}

export async function fetchData({ saveFn, retires, concurrent, delay } = {}) {
  const [
    { elements: fplPlayers, teams: fplTeams, events: fplGameWeeks },
    understatPlayers,
    { teamsData },
  ] = await Promise.all([
    await getFPLData(),
    await getUnderstatPlayers(),
    await getUnderstatData(),
  ]);

  return Promise.all([
    asyncPool(concurrent?.fpl || 1, fplPlayers.slice(0, 1), (p) =>
      pRetry(
        async () => {
          try {
            const summary = await getFPLPlayerSummaryData(p.id);
            const data = { ...p, ...summary };
            await saveFn?.(data, "fpl");
            delay?.fpl && (await wait(delay));
            return data;
          } catch (e) {
            throw e;
          }
        },
        { retries: retires?.fpl || 5 }
      )
    ),
    asyncPool(concurrent?.understat || 1, understatPlayers.slice(0, 1), (p) =>
      pRetry(
        async () => {
          try {
            const stats = await getUnderstatPlayerData(p.id);
            const data = { ...p, ...stats };
            await saveFn?.(data, "understat");
            delay?.understat && (await wait(delay));
            return data;
          } catch (e) {
            throw e;
          }
        },
        { retries: retires?.understat || 5 }
      )
    ),
    saveFn?.(fplTeams, "fpl_teams"),
    asyncPool(concurrent?.understat_teams || 1, Object.values(teamsData), (p) =>
      pRetry(
        async () => {
          try {
            p.id = p.title.replace(/ /g, "_"); // title is being used as reference instead of actual id in other dataset
            const stats = await getUnderstatTeamData(p.id);
            const data = { ...p, ...stats };
            await saveFn?.(data, "understat_teams");
            delay?.understat_teams && (await wait(delay));
            return data;
          } catch (e) {
            throw e;
          }
        },
        { retries: retires?.understat_teams || 5 }
      )
    ),
    saveFn?.(fplGameWeeks, "fpl_gameweeks"),
  ]);
}
