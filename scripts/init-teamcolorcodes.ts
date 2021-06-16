import fs from "fs";
import { getTeamColorCodes } from "~/features/AppData/teamcolorcodes";

(async function () {
  await fs.promises.mkdir("./public/data/teamcolorcodes", { recursive: true });
  const teamcolorcodes = await getTeamColorCodes();
  await fs.promises.writeFile(
    `./public/data/teamcolorcodes/data.json`,
    JSON.stringify(teamcolorcodes, null, 2)
  );
})();
