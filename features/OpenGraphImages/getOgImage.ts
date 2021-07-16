import { baseUrl } from "~/features/Navigation/internalUrls";

// NOTE:
// 1. If you want to change this function name, please make sure to
//    change functionName in ~/scripts/make-og-images.ts as well
//    since it detects images to generate by this function name
// 2. Make sure to run `yarn make-og-images` if you add new Open Graph Images
//    in a new page.
//
// For now, I cannot find a better way to automate this since
// 1. https://github.com/vercel/og-image approach somehow exceed functions limitations
//    in this project.
// 2. Vercel build process does not support chrome-aws-lambda and install Chromium
//    there for every build does not make much sense.
// 3. Github Actions also requires you to install Chromium so it is not really
//    ideal way to utilise the resource.
//
// Hence, just do it locally and push to git for now.

const getOgImage = (path: string) => {
  return `${baseUrl}/og-images/${path}`;
};

export default getOgImage;
