import fs from "fs";
import path from "path";

// NOTE: This should be used in pages/index.ts and pages/transfer/[id].ts but due to webpack or nextjs limitation,
// fs / path package need to be imported from there so it knows that it is being used on server side
export default async function getDataFromFiles(dirPath: string) {
  return Promise.all(
    (await fs.promises.readdir(dirPath)).map((p) =>
      fs.promises
        .readFile(path.join(dirPath, p), { encoding: "utf-8" })
        .then(JSON.parse)
    )
  );
}
