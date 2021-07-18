import fs from "fs";
import { fetchData } from "@open-fpl/data/features/RemoteData/remoteData";

const { RESOURCES_LIMIT: resourcesLimit } = process.env;

(async function () {
  if (resourcesLimit !== "0") {
    const start = new Date();
    console.log(`Updates started: ${start}`);
    await Promise.all([
      fs.promises.mkdir("./public/remote-data/fpl", { recursive: true }),
      fs.promises.mkdir("./public/remote-data/understat", { recursive: true }),
      fs.promises.mkdir("./public/remote-data/fpl_teams", { recursive: true }),
      fs.promises.mkdir("./public/remote-data/fpl_element_types", {
        recursive: true,
      }),
      fs.promises.mkdir("./public/remote-data/understat_teams", {
        recursive: true,
      }),
      fs.promises.mkdir("./public/remote-data/fpl_gameweeks", {
        recursive: true,
      }),
    ]);
    await fetchData({
      saveFn: (data, type) => {
        return fs.promises.writeFile(
          `./public/remote-data/${type}/${data.id || "data"}.json`,
          JSON.stringify(data, null, 2)
        );
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
      resourcesLimit: resourcesLimit
        ? {
            fpl: +resourcesLimit,
            understat: +resourcesLimit,
            understat_teams: +resourcesLimit,
          }
        : undefined,
    });
    console.log(
      `Time elapsed: ${(
        new Date().getTime() - start.getTime()
      ).toLocaleString()}ms`
    );
  }
})();
