import fs from "fs";
import glob from "glob-promise";
import { parseRequest } from "@open-fpl/app/features/OpenGraphImages/parser";
import { getScreenshot } from "@open-fpl/app/features/OpenGraphImages/chromium";
import { getHtml } from "@open-fpl/app/features/OpenGraphImages/template";

const isDev = !process.env.AWS_REGION;

// TODO: find another library that can do this directly
const Parser = require("i18next-scanner").Parser;

const parser = new Parser();

const functionName = "getOgImage";

const parseFile = async (parser: any, path: string) => {
  if (fs.lstatSync(path).isFile()) {
    const content = await fs.promises.readFile(path, "utf-8");
    parser.parseFuncFromString(
      content,
      { list: [functionName] },
      // @ts-ignore
      (key, options) => {
        parser.set(
          key,
          Object.assign({}, options, {
            nsSeparator: false,
            keySeparator: false,
          })
        );
      }
    );
  }
};

const makeImage = async (image: string) => {
  try {
    const url = new URL(`/${image}`, "https://does.not.matter");
    const parsedReq = await parseRequest(url);
    const html = await getHtml(parsedReq);
    const { fileType } = parsedReq;
    const savePath = `./public/og-images/${parsedReq.text}.${parsedReq.fileType}`;
    await getScreenshot(html, fileType, savePath, isDev);
  } catch (e) {
    console.error(e);
  }
};

const makeOgImages = async () => {
  const paths = await glob("pages/**/*");

  await Promise.all(paths.map((path) => parseFile(parser, path)));

  await Promise.all(
    Object.keys(parser.get().en.translation).map((image) => makeImage(image))
  );
};

(async () => {
  const start = new Date();
  await makeOgImages();
  console.log(
    `Time elapsed: ${(
      new Date().getTime() - start.getTime()
    ).toLocaleString()}ms`
  );
})();
