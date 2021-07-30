#!/usr/bin/env ts-node -O {"module":"commonjs"} -r tsconfig-paths/register

import theme from "@open-fpl/common/theme";
import fs from "fs";

const config = {
  masterPicture: "./public/logo.svg",
  iconsPath: "/favicons/",
  design: {
    ios: {
      pictureAspect: "noChange",
      assets: {
        ios6AndPriorIcons: false,
        ios7AndLaterIcons: false,
        precomposedIcons: false,
        declareOnlyDefaultIcon: true,
      },
    },
    desktopBrowser: {
      design: "raw",
    },
    windows: {
      pictureAspect: "noChange",
      backgroundColor: theme.colors.brand[500],
      onConflict: "override",
      assets: {
        windows80Ie10Tile: false,
        windows10Ie11EdgeTiles: {
          small: false,
          medium: true,
          big: false,
          rectangle: false,
        },
      },
    },
    androidChrome: {
      pictureAspect: "noChange",
      themeColor: "#ffffff",
      manifest: {
        name: "Open FPL",
        display: "standalone",
        orientation: "notSet",
        onConflict: "override",
        declared: true,
      },
      assets: {
        legacyIcon: false,
        lowResolutionIcons: false,
      },
    },
    safariPinnedTab: {
      pictureAspect: "blackAndWhite",
      threshold: 65.625,
      themeColor: theme.colors.brand[500],
    },
  },
  settings: {
    scalingAlgorithm: "Mitchell",
    errorOnImageTooSmall: false,
    readmeFile: false,
    htmlCodeFile: false,
    usePathAsIs: false,
  },
};

const makeCliRealFavIconConfig = async () => {
  return fs.promises.writeFile(
    "./config.cli-real-favicon.json",
    JSON.stringify(config, null, 2),
    "utf8"
  );
};

(async function () {
  await makeCliRealFavIconConfig();
})();
