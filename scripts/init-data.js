import fs from "fs";
import { fetchData } from "../libs/data";

(async function () {
  // const start = new Date();
  // console.log(`Updates started: ${start}`);
  // await Promise.all([
  //   fs.promises.mkdir("./data/fpl", { recursive: true }),
  //   fs.promises.mkdir("./data/understat", { recursive: true }),
  //   fs.promises.mkdir("./data/fpl_teams", { recursive: true }),
  //   fs.promises.mkdir("./data/understat_teams", { recursive: true }),
  //   fs.promises.mkdir("./data/fpl_gameweeks", { recursive: true }),
  // ]);
  // await fetchData({
  //   saveFn: (data, type) => {
  //     return fs.promises.writeFile(
  //       `./data/${type}/${data.id || "data"}.json`,
  //       JSON.stringify(data, null, 2)
  //     );
  //   },
  //   retries: {
  //     fpl: 5,
  //     understat: 5,
  //     fpl_teams: 5,
  //     understat_teams: 5,
  //     fpl_gameweeks: 5,
  //   },
  //   concurrent: {
  //     fpl: 1,
  //     understat: 1,
  //     fpl_teams: 2,
  //     understat_teams: 2,
  //     fpl_gameweeks: 1,
  //   },
  //   delay: {
  //     fpl: 0,
  //     understat: 0,
  //     fpl_teams: 0,
  //     understat_teams: 0,
  //     fpl_gameweeks: 0,
  //   },
  // });
  // console.log(`Time elapsed: ${(new Date() - start).toLocaleString()}ms`);
})();
