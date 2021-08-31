import { makeAppData } from "@open-fpl/data/features/AppData/appData";
import { FPLElement } from "@open-fpl/data/features/AppData/playerDataTypes";
import {
  Bootstrap,
  Element,
  ElementTypes,
  Event,
  Team,
  Fixture,
} from "@open-fpl/data/features/RemoteData/fplTypes";
import getDataFromFiles from "@open-fpl/data/features/RemoteData/getDataFromFiles";
import { fetchData } from "@open-fpl/data/features/RemoteData/remoteData";
import {
  GetUnderstatPlayersResponse,
  LeagueStat,
  LeagueTeamStat,
  PlayerStat,
  PlayerStatSummary,
  TeamStat,
} from "@open-fpl/data/features/RemoteData/understatTypes";
import { createClient, SupabaseClient } from "@supabase/supabase-js";
import fs from "fs-extra";
import pRetry from "p-retry";
import path from "path";

const {
  SUPABASE_SECRET_KEY: supabaseSecretKey,
  SUPABASE_URL: supabaseUrl,
  SUPABASE_STORAGE_NAME: _supabaseStorageName,
  IGNORE_SNAPSHOTS: _ignoreSnapshots,
  SKIP_UPDATE: _skipUpdate,
  FORCE_SAVE_TO_DISK: _forceSaveToDisk,
} = process.env;

const ignoreSnapshots = _ignoreSnapshots === "true";
const skipUpdate = _skipUpdate === "true";
const supabaseStorageName = _supabaseStorageName ?? "open-fpl";
const forceSaveToDisk = _forceSaveToDisk === "true";

type Snapshots = {
  snapshot_fpl_data: Bootstrap | null;
  snapshot_understat_data: LeagueStat | null;
  snapshot_understat_players_data: GetUnderstatPlayersResponse | null;
};

type StorageStrategies = {
  [key: string]: {
    client?: any;
    init?: () => Promise<any> | void;
    saveRemoteData: (type: string, data: any) => Promise<any> | void;
    saveAppData: (type: string, data: any) => Promise<any> | void;
    getPreviousSnapshots?: () => Promise<Snapshots> | Snapshots;
    saveSnapshots?: (snapshots: Snapshots) => Promise<any> | void;
    retrivedRemoteData: (type: string, id?: string) => Promise<any> | any;
    finalise?: () => Promise<any> | void;
  };
};

const makeRemoteDataFolders = (name: string) => {
  return Promise.all([
    fs.promises.mkdir(`./public/remote-data/${name}`, { recursive: true }),
  ]);
};

const strategies: StorageStrategies = {
  disk: {
    init: function () {
      return Promise.all([
        makeRemoteDataFolders("fpl"),
        makeRemoteDataFolders("fpl_fixtures"),
        makeRemoteDataFolders("fpl_teams"),
        makeRemoteDataFolders("fpl_element_types"),
        makeRemoteDataFolders("fpl_gameweeks"),
        makeRemoteDataFolders("understat"),
        makeRemoteDataFolders("understat_teams"),
        makeRemoteDataFolders("snapshot_fpl_data"),
        makeRemoteDataFolders("snapshot_understat_data"),
        makeRemoteDataFolders("snapshot_understat_players_data"),
      ]);
    },
    saveRemoteData: function (type: string, data: any) {
      const path = `./public/remote-data/${type}/${data.id || "data"}.json`;
      return fs.promises.writeFile(path, JSON.stringify(data, null, 2));
    },
    saveAppData: function (type: string, data: any) {
      const path = `./public/app-data/${type}.json`;
      return fs.promises.writeFile(path, JSON.stringify(data, null, 2));
    },
    saveSnapshots: function (snapshots: Snapshots) {
      return Promise.all([
        snapshots.snapshot_fpl_data &&
          this.saveRemoteData("snapshot_fpl_data", snapshots.snapshot_fpl_data),
        snapshots.snapshot_understat_data &&
          this.saveRemoteData(
            "snapshot_understat_data",
            snapshots.snapshot_understat_data
          ),
        snapshots.snapshot_understat_players_data &&
          this.saveRemoteData(
            "snapshot_understat_players_data",
            snapshots.snapshot_understat_players_data
          ),
      ]);
    },
    retrivedRemoteData: function (type: string, id?: string) {
      if (id) {
        return fs.promises
          .readFile(`./public/remote-data/${type}/${id}.json`, {
            encoding: "utf-8",
          })
          .then(JSON.parse);
      } else {
        return getDataFromFiles(path.resolve(`./public/remote-data/${type}`));
      }
    },
    finalise: function () {
      return Promise.all([
        fs.copy("./public/remote-data", "./remote-data"),
        fs.copy("./public/app-data", "./app-data"),
      ]);
    },
  },
  supabase: {
    init: function () {
      this.client = createClient(supabaseUrl!, supabaseSecretKey!, {
        headers: {},
      });
    },
    saveRemoteData: async function (type: string, data: any) {
      const supabase = this.client as SupabaseClient;
      const [{ error: dbError }, { error: storageError }] = await Promise.all([
        supabase
          .from(type)
          .insert([{ id: data.id ?? 1, data }], { upsert: true }),
        supabase.storage
          .from(supabaseStorageName)
          .upload(
            `remote-data/${type}/${data.id || "data"}.json`,
            JSON.stringify(data),
            {
              contentType: "application/json",
              upsert: true,
            }
          ),
      ]);

      if (dbError)
        throw new Error(`Error saving ${type} Supabase DB: ${dbError.message}`);

      if (storageError)
        throw new Error(
          `Error saving ${type} Supabase storage: ${storageError.message}`
        );
    },
    saveAppData: async function (type: string, data: any) {
      const supabase = this.client as SupabaseClient;
      const { error } = await supabase.storage
        .from(supabaseStorageName)
        .upload(`app-data/${type}.json`, JSON.stringify(data), {
          contentType: "application/json",
          upsert: true,
        });

      if (error)
        throw new Error(`Save to Storage error ${type}: ${error.message}`);
    },
    getPreviousSnapshots: async function () {
      const supabase = this.client as SupabaseClient;
      const [
        { data: fplSnapshotResponse, error: fplSnapshotError },
        { data: understatSnapshotResponse, error: understatSnapshotError },
        {
          data: understatPlayersSnapshotResponse,
          error: understatPlayersSnapshotError,
        },
      ] = await Promise.all([
        supabase.from("snapshot_fpl_data").select("data").single(),
        supabase.from("snapshot_understat_data").select("data").single(),
        supabase
          .from("snapshot_understat_players_data")
          .select("data")
          .single(),
      ]);

      const snapshot_fpl_data = fplSnapshotResponse?.data ?? null;
      const snapshot_understat_data = understatSnapshotResponse?.data ?? null;
      const snapshot_understat_players_data =
        understatPlayersSnapshotResponse?.data ?? null;

      // NOTE: ignore error and return null to start over instead
      // if (fplSnapshotError)
      //   throw new Error(
      //     `Error getting snapshot_fpl_data: ${fplSnapshotError.message}`
      //   );

      // if (understatSnapshotError)
      //   throw new Error(
      //     `Error getting snapshot_understat_data: ${understatSnapshotError.message}`
      //   );

      // if (understatPlayersSnapshotError)
      //   throw new Error(
      //     `Error getting snapshot_understat_players_data: ${understatPlayersSnapshotError.message}`
      //   );

      return {
        snapshot_fpl_data,
        snapshot_understat_data,
        snapshot_understat_players_data,
      };
    },
    saveSnapshots: function (snapshots: Snapshots) {
      return Promise.all([
        snapshots.snapshot_fpl_data &&
          this.saveRemoteData("snapshot_fpl_data", snapshots.snapshot_fpl_data),
        snapshots.snapshot_understat_data &&
          this.saveRemoteData(
            "snapshot_understat_data",
            snapshots.snapshot_understat_data
          ),
        snapshots.snapshot_understat_players_data &&
          this.saveRemoteData(
            "snapshot_understat_players_data",
            snapshots.snapshot_understat_players_data
          ),
      ]);
    },
    retrivedRemoteData: async function (type: string, id?: string) {
      const supabase = this.client as SupabaseClient;
      if (id) {
        const { data, error } = await supabase
          .from(type)
          .select("data")
          .single();
        if (error)
          throw new Error(
            `Error getting ${type} ${id} from Supabase DB: ${error.message}`
          );
        return data.data;
      } else {
        const { data, error } = await supabase.from(type).select("data");
        if (error)
          throw new Error(
            `Error getting ${type} from Supabase DB: ${error.message}`
          );
        return data?.map((row) => row.data);
      }
    },
  },
};

(async function () {
  const isSupabaseMode = supabaseSecretKey !== undefined;
  const strategy =
    isSupabaseMode && supabaseUrl ? strategies.supabase : strategies.disk;

  if (isSupabaseMode)
    console.log("Found Supabase key and url, using Supabase data storage");

  const start = new Date();
  console.log(`Updates started: ${start}`);

  await strategy.init?.();

  if (forceSaveToDisk) {
    console.log("Found force saving to disk config");
    await strategies.disk.init?.();
  }

  if (!ignoreSnapshots) console.log("Preparing Snapshot data...");

  const previousSnapshots: Snapshots = (ignoreSnapshots
    ? null
    : await strategy.getPreviousSnapshots?.()) ?? {
    snapshot_fpl_data: null,
    snapshot_understat_data: null,
    snapshot_understat_players_data: null,
  };

  if (previousSnapshots.snapshot_fpl_data)
    console.log("Using FPL Snapshot data");
  if (previousSnapshots.snapshot_understat_data)
    console.log("Using Understat Snapshot data");
  if (previousSnapshots.snapshot_understat_players_data)
    console.log("Using Understat Players Snapshot data");

  const currentSnapshots: Snapshots = {
    snapshot_fpl_data: null,
    snapshot_understat_data: null,
    snapshot_understat_players_data: null,
  };

  if (skipUpdate) {
    console.log("Skipping update remote data...");
  } else {
    console.log("Updating remote data...");
  }

  const [remoteData, playersLinks, teamsLinks] = await Promise.all([
    skipUpdate
      ? null
      : fetchData({
          onSnapShotLoaded: async (
            fplData,
            understatData,
            understatPlayersResponse
          ) => {
            currentSnapshots.snapshot_fpl_data = fplData;
            currentSnapshots.snapshot_understat_data = understatData;
            currentSnapshots.snapshot_understat_players_data =
              understatPlayersResponse;
          },
          saveFn: {
            fpl: (data) => strategy.saveRemoteData("fpl", data),
            fpl_fixtures: (data) =>
              strategy.saveRemoteData("fpl_fixtures", data),
            fpl_element_types: (data) =>
              strategy.saveRemoteData("fpl_element_types", data),
            fpl_gameweeks: (data) =>
              strategy.saveRemoteData("fpl_gameweeks", data),
            fpl_teams: (data) => strategy.saveRemoteData("fpl_teams", data),
            understat: (data) => strategy.saveRemoteData("understat", data),
            understat_teams: (data) =>
              strategy.saveRemoteData("understat_teams", data),
          },
          retries: {
            fpl: 5,
            understat: 5,
            understat_teams: 5,
          },
          concurrent: {
            fpl: 1,
            understat: 1,
            understat_teams: 1,
          },
          delay: {
            fpl: 0,
            understat: 0,
            understat_teams: 0,
          },
          getItemsToUpdate: {
            fpl: (list: Element[]) => {
              // Always update
              console.log(`Updating ${list.length} FPL elements`);
              return list;
            },
            understat: (list: PlayerStatSummary[]) => {
              let toBeUpdated = [...list];

              if (previousSnapshots.snapshot_understat_players_data !== null) {
                toBeUpdated = toBeUpdated.filter((player, index) => {
                  const matched =
                    previousSnapshots.snapshot_understat_players_data?.response.players.find(
                      (p) => p.id === player.id
                    );

                  if (matched) {
                    // Only update if number of games played changed
                    return matched.games !== player.games;
                  } else {
                    // New players
                    return true;
                  }
                });
              }

              console.log(`Updating ${toBeUpdated.length} Understat players`);
              return toBeUpdated;
            },
            understat_teams: (list: LeagueTeamStat[]) => {
              let toBeUpdated = [...list];

              if (previousSnapshots.snapshot_understat_data !== null) {
                toBeUpdated = toBeUpdated.filter((team) => {
                  const matched = Object.values(
                    previousSnapshots.snapshot_understat_data!.teamsData
                  ).find((t) => t.id === team.id);

                  if (matched) {
                    // Only update if number of games played changed
                    return matched.history.length !== team.history.length;
                  } else {
                    // New teams
                    return true;
                  }
                });
              }

              console.log(`Updating ${toBeUpdated.length} Understat teams`);
              return toBeUpdated;
            },
          },
        }),
    fs.promises
      .readFile(path.resolve("./public/app-data/links/players.json"), {
        encoding: "utf-8",
      })
      .then(JSON.parse) as Promise<Record<string, string>>,
    fs.promises
      .readFile(path.resolve("./public/app-data/links/teams.json"), {
        encoding: "utf-8",
      })
      .then(JSON.parse) as Promise<Record<string, string>>,
  ]);

  console.log(`${remoteData?.fpl.length ?? 0} FPL elements are updated.`);
  console.log(
    `${remoteData?.understat.length ?? 0} Understat players are updated.`
  );
  console.log(
    `${remoteData?.understatTeams.length ?? 0} Understat teams are updated.`
  );

  console.log("Saving snapshots...");
  await strategy.saveSnapshots?.(currentSnapshots);

  console.log("Pulling latest remote data...");

  // NOTE 1: Use full remote data to generate app-data in case of some of those get skipped in update process
  // NOTE 2: Got socket hung up error quite often so pRetry is needed here
  const [
    fpl,
    fplFixtures,
    understat,
    understatTeams,
    fplElementTypes,
    fplGameweeks,
    fplTeams,
  ] = await Promise.all([
    pRetry(() => strategy.retrivedRemoteData("fpl") as FPLElement[], {
      retries: 5,
      onFailedAttempt: (error) => {
        console.log(`Pulling fpl error ${error.message}`);
      },
    }),
    pRetry(
      () => strategy.retrivedRemoteData("fpl_fixtures", "data") as Fixture[],
      {
        retries: 5,
        onFailedAttempt: (error) => {
          console.log(`Pulling fpl error ${error.message}`);
        },
      }
    ),
    pRetry<PlayerStat[]>(() => strategy.retrivedRemoteData("understat"), {
      retries: 5,
      onFailedAttempt: (error) => {
        console.log(`Pulling understat error: ${error.message}`);
      },
    }),
    pRetry<TeamStat[]>(() => strategy.retrivedRemoteData("understat_teams"), {
      retries: 5,
      onFailedAttempt: (error) => {
        console.log(`Pulling understat_teams error ${error.message}`);
      },
    }),
    pRetry(
      () =>
        strategy.retrivedRemoteData(
          "fpl_element_types",
          "data"
        ) as ElementTypes[],
      {
        retries: 5,
        onFailedAttempt: (error) => {
          console.log(`Pulling fpl_element_types error ${error.message}`);
        },
      }
    ),
    pRetry(
      () => strategy.retrivedRemoteData("fpl_gameweeks", "data") as Event[],
      {
        retries: 5,
        onFailedAttempt: (error) => {
          console.log(`Pulling fpl_gameweeks error ${error.message}`);
        },
      }
    ),
    pRetry(() => strategy.retrivedRemoteData("fpl_teams", "data") as Team[], {
      retries: 5,
      onFailedAttempt: (error) => {
        console.log(`Pulling fpl_teams error ${error.message}`);
      },
    }),
  ]);

  console.log(`${fpl.length} FPL elements are pulled.`);
  console.log(`${understat.length} Understat players are pulled.`);
  console.log(`${understatTeams.length} Understat teams are pulled.`);

  console.log("Making app data...");

  const { players, fixtures, teams } = makeAppData({
    fpl,
    understat,
    understatTeams,
    fplFixtures,
    fplElementTypes,
    fplGameweeks,
    fplTeams,
    playersLinks,
    teamsLinks,
  });

  await Promise.all([
    strategy.saveAppData("links/players", playersLinks),
    strategy.saveAppData("links/teams", teamsLinks),
    strategy.saveAppData("players", players),
    strategy.saveAppData("fixtures", fixtures),
    strategy.saveAppData("teams", teams),
  ]);

  // NOTE: this is used for deploying to data.openfpl.com as temporary data storage as Supabase storage become really slow
  if (forceSaveToDisk) {
    console.log("Force saving all data to local disk...");
    await Promise.all([
      ...fpl.map((e) => {
        return strategies.disk.saveRemoteData("fpl", e);
      }),
      ...understat.map((e) => {
        return strategies.disk.saveRemoteData("understat", e);
      }),
      ...understatTeams.map((e) => {
        return strategies.disk.saveRemoteData("understat_teams", e);
      }),
      strategies.disk.saveRemoteData("fpl_element_types", fplElementTypes),
      strategies.disk.saveRemoteData("fpl_gameweeks", fplGameweeks),
      strategies.disk.saveRemoteData("fpl_teams", fplTeams),

      strategies.disk.saveAppData("links/players", playersLinks),
      strategies.disk.saveAppData("links/teams", teamsLinks),
      strategies.disk.saveAppData("players", players),
      strategies.disk.saveAppData("fixtures", fixtures),
      strategies.disk.saveAppData("teams", teams),
    ]);
  }

  console.log("App data is created.");

  await strategy.finalise?.();

  console.log("All done.");
})();
