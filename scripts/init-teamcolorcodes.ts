import fs from "fs";
import { getTeamColorCodes } from "~/features/RemoteData/teamcolorcodes";

(async function () {
  await fs.promises.mkdir("./public/remote-data/teamcolorcodes", {
    recursive: true,
  });
  const teamcolorcodes = await getTeamColorCodes();
  await fs.promises.writeFile(
    `./public/remote-data/teamcolorcodes/data.json`,
    JSON.stringify(teamcolorcodes, null, 2)
  );
})();
