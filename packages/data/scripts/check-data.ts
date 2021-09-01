import fs from "fs";

if (
  fs.existsSync("./public/app-data/fixtures.json") &&
  fs.existsSync("./public/app-data/players.json") &&
  fs.existsSync("./public/app-data/teams.json")
) {
  // Success
  process.exit(0);
} else {
  // Fail
  console.log("App data is not correctly created.");
  process.exit(1);
}
