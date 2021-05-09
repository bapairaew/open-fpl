import fs from "fs";
import { getTeamColorCodes } from "../libs/teamcolorcodes";

(async function () {
  await fs.promises.mkdir("./data/teamcolorcodes", { recursive: true });
  const teamcolorcodes = await getTeamColorCodes();
  await fs.promises.writeFile(
    `./data/teamcolorcodes/data.json`,
    JSON.stringify(teamcolorcodes, null, 2)
  );
})();
