import core from "puppeteer-core";
import { getOptions } from "@open-fpl/app/features/OpenGraphImages/options";
import { FileType } from "@open-fpl/app/features/OpenGraphImages/openGraphImagestypes";
let _page: core.Page | null;

async function getPage(isDev: boolean) {
  if (_page) {
    return _page;
  }
  const options = await getOptions(isDev);
  const browser = await core.launch(options);
  _page = await browser.newPage();
  return _page;
}

export async function getScreenshot(
  html: string,
  type: FileType,
  savePath: string,
  isDev: boolean
) {
  const page = await getPage(isDev);
  await page.setViewport({ width: 2048, height: 1170 });
  await page.setContent(html);
  const file = await page.screenshot({ type, path: savePath });
  return file;
}
