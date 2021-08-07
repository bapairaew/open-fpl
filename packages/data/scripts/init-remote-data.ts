import {
  Bootstrap,
  Element,
} from "@open-fpl/data/features/RemoteData/fplTypes";
import { fetchData } from "@open-fpl/data/features/RemoteData/remoteData";
import {
  GetUnderstatPlayersResponse,
  LeagueStat,
  LeagueTeamStat,
  PlayerStatSummary,
} from "@open-fpl/data/features/RemoteData/understatTypes";
import { createClient, SupabaseClient } from "@supabase/supabase-js";
import fs from "fs";

const {
  RESOURCES_LIMIT: resourcesLimit,
  SUPABASE_SECRET_KEY: supabaseSecretKey,
} = process.env;

type Snapshots = {
  snapshot_fpl_data: Bootstrap | null;
  snapshot_understat_data: LeagueStat | null;
  snapshot_understat_players_data: GetUnderstatPlayersResponse | null;
};

type StorageStrategy = {
  [key: string]: {
    client?: any;
    init?: () => Promise<any> | void;
    save?: (type: string, data: any) => Promise<any> | void;
    getPreviousSnapshots?: () => Promise<Snapshots> | Snapshots;
    saveSnapshots?: (snapshots: Snapshots) => Promise<any> | void;
  };
};

const makeRemoteDataFolders = (name: string) => {
  return Promise.all([
    fs.promises.mkdir(`./public/remote-data/${name}`, { recursive: true }),
  ]);
};

const strategies: StorageStrategy = {
  disk: {
    init: function () {
      return Promise.all([
        makeRemoteDataFolders("fpl"),
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
    save: function (type: string, data: any) {
      const path = `./public/remote-data/${type}/${data.id || "data"}.json`;
      return fs.promises.writeFile(path, JSON.stringify(data, null, 2));
    },
    saveSnapshots: function (snapshots: Snapshots) {
      return Promise.all([
        this.save?.("snapshot_fpl_data", snapshots.snapshot_fpl_data),
        this.save?.(
          "snapshot_understat_data",
          snapshots.snapshot_understat_data
        ),
        this.save?.(
          "snapshot_understat_players_data",
          snapshots.snapshot_understat_players_data
        ),
      ]);
    },
  },
  supabase: {
    init: function () {
      const supabaseUrl = "https://mykqeejhvjrahzpflsot.supabase.co";
      this.client = createClient(supabaseUrl, supabaseSecretKey!);
    },
    save: async function (type: string, data: any) {
      try {
        const supabase = this.client as SupabaseClient;
        await supabase
          .from(type)
          .insert([{ id: data.id || 1, data }], { upsert: true });
      } catch (e) {
        console.error(e);
      }
    },
    getPreviousSnapshots: async function () {
      const supabase = this.client as SupabaseClient;
      const [
        { data: snapshot_fpl_data },
        { data: snapshot_understat_data },
        { data: snapshot_understat_players_data },
      ] = await Promise.all([
        supabase.from("snapshot_fpl_data").select("*").single(),
        supabase.from("snapshot_understat_data").select("*").single(),
        supabase.from("snapshot_understat_players_data").select("*").single(),
      ]);

      return {
        snapshot_fpl_data,
        snapshot_understat_data,
        snapshot_understat_players_data,
      };
    },
    saveSnapshots: function (snapshots: Snapshots) {
      return Promise.all([
        this.save?.("snapshot_fpl_data", snapshots.snapshot_fpl_data),
        this.save?.(
          "snapshot_understat_data",
          snapshots.snapshot_understat_data
        ),
        this.save?.(
          "snapshot_understat_players_data",
          snapshots.snapshot_understat_players_data
        ),
      ]);
    },
  },
};

(async function () {
  const isSupabaseMode = supabaseSecretKey !== undefined;
  const strategy = isSupabaseMode ? strategies.supabase : strategies.disk;

  if (isSupabaseMode)
    console.log("Found Supabase key, using Supabase data storage");

  if (resourcesLimit !== "0") {
    const start = new Date();
    console.log(`Updates started: ${start}`);

    await strategy.init?.();

    const previousSnapshots: Snapshots =
      (await strategy.getPreviousSnapshots?.()) ?? {
        snapshot_fpl_data: null,
        snapshot_understat_data: null,
        snapshot_understat_players_data: null,
      };

    const currentSnapshots: Snapshots = {
      snapshot_fpl_data: null,
      snapshot_understat_data: null,
      snapshot_understat_players_data: null,
    };

    await fetchData({
      onSnapShotLoaded: async (
        fplData,
        understatData,
        understatPlayersResponse
      ) => {
        currentSnapshots.snapshot_fpl_data = fplData;
        currentSnapshots.snapshot_understat_data = understatData;
        currentSnapshots.snapshot_understat_players_data =
          understatPlayersResponse;

        await strategy.saveSnapshots?.(currentSnapshots);
      },
      saveFn: {
        fpl: (data) => strategy.save?.("fpl", data),
        understat: (data) => strategy.save?.("understat", data),
        fpl_teams: (data) => strategy.save?.("fpl_teams", data),
        fpl_element_types: (data) => strategy.save?.("fpl_element_types", data),
        understat_teams: (data) => strategy.save?.("understat_teams", data),
        fpl_gameweeks: (data) => strategy.save?.("fpl_gameweeks", data),
      },
      retries: {
        fpl: 5,
        understat: 5,
        understat_teams: 5,
      },
      concurrent: {
        fpl: 1,
        understat: 1,
        understat_teams: 2,
      },
      delay: {
        fpl: 0,
        understat: 0,
        understat_teams: 0,
      },
      getItemsToUpdate: {
        fpl: (list: Element[]) => {
          // Always update
          return resourcesLimit ? list.slice(0, +resourcesLimit) : list;
        },
        understat: (list: PlayerStatSummary[]) => {
          let toBeUpdated = [...list];

          if (previousSnapshots.snapshot_understat_data !== null) {
            toBeUpdated = toBeUpdated.filter((player) => {
              const matched =
                previousSnapshots.snapshot_understat_data!.playersData.find(
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

          return resourcesLimit
            ? toBeUpdated.slice(0, +resourcesLimit)
            : toBeUpdated;
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

          return resourcesLimit
            ? toBeUpdated.slice(0, +resourcesLimit)
            : toBeUpdated;
        },
      },
    });

    console.log(
      `Time elapsed: ${(
        new Date().getTime() - start.getTime()
      ).toLocaleString()}ms`
    );
  }
})();
