import { createClient, SupabaseClient } from "@supabase/supabase-js";
import fs from "fs-extra";

const { SUPABASE_SECRET_KEY: supabaseSecretKey, SUPABASE_URL: supabaseUrl } =
  process.env;

const makeRemoteDataFolders = (name: string) => {
  return Promise.all([
    fs.promises.mkdir(`./public/remote-data/${name}`, { recursive: true }),
  ]);
};

type CopyStrategies = {
  [key: string]: {
    client?: any;
    init?: () => Promise<any> | void;
    copy: () => Promise<any> | void;
  };
};

const strategies: CopyStrategies = {
  disk: {
    copy: function () {
      return fs.copy("./public/remote-data", "./remote-data");
    },
  },
  supabase: {
    init: function () {
      this.client = createClient(supabaseUrl!, supabaseSecretKey!);
    },
    copy: async function () {
      const supabase = this.client as SupabaseClient;

      await Promise.all([
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

      await Promise.all([
        supabase
          .from("fpl")
          .select("data")
          .then((res) =>
            Promise.all(
              res.data?.map((row) =>
                fs.promises.writeFile(
                  `./public/remote-data/fpl/${row.data.id}.json`,
                  JSON.stringify(row.data)
                )
              ) ?? []
            )
          ),
        supabase
          .from("fpl_element_types")
          .select("data")
          .single()
          .then((res) =>
            fs.promises.writeFile(
              "./public/remote-data/fpl_element_types/data.json",
              JSON.stringify(res.data.data)
            )
          ),
        supabase
          .from("fpl_gameweeks")
          .select("data")
          .single()
          .then((res) =>
            fs.promises.writeFile(
              "./public/remote-data/fpl_gameweeks/data.json",
              JSON.stringify(res.data.data)
            )
          ),
        supabase
          .from("fpl_teams")
          .select("data")
          .single()
          .then((res) =>
            fs.promises.writeFile(
              "./public/remote-data/fpl_teams/data.json",
              JSON.stringify(res.data.data)
            )
          ),
        supabase
          .from("snapshot_fpl_data")
          .select("data")
          .single()
          .then((res) =>
            fs.promises.writeFile(
              "./public/remote-data/snapshot_fpl_data/data.json",
              JSON.stringify(res.data.data)
            )
          ),
        supabase
          .from("snapshot_understat_data")
          .select("data")
          .single()
          .then((res) =>
            fs.promises.writeFile(
              "./public/remote-data/snapshot_understat_data/data.json",
              JSON.stringify(res.data.data)
            )
          ),
        supabase
          .from("snapshot_understat_players_data")
          .select("data")
          .single()
          .then((res) =>
            fs.promises.writeFile(
              "./public/remote-data/snapshot_understat_players_data/data.json",
              JSON.stringify(res.data.data)
            )
          ),
        supabase
          .from("understat")
          .select("data")
          .then((res) =>
            Promise.all(
              res.data?.map((row) =>
                fs.promises.writeFile(
                  `./public/remote-data/understat/${row.data.id}.json`,
                  JSON.stringify(row.data)
                )
              ) ?? []
            )
          ),
        ,
        supabase
          .from("understat_teams")
          .select("data")
          .then((res) =>
            Promise.all(
              res.data?.map((row) =>
                fs.promises.writeFile(
                  `./public/remote-data/understat_teams/${row.data.id}.json`,
                  JSON.stringify(row.data)
                )
              ) ?? []
            )
          ),
      ]);

      await fs.copy("./public/remote-data", "./remote-data");
    },
  },
};

(async () => {
  const isSupabaseMode = supabaseSecretKey !== undefined;
  const strategy =
    isSupabaseMode && supabaseUrl ? strategies.supabase : strategies.disk;

  if (isSupabaseMode)
    console.log("Found Supabase key and url, using Supabase data storage");

  const start = new Date();
  console.log(`Remote data copy started: ${start}`);

  await strategy.init?.();
  await strategy.copy();
})();
