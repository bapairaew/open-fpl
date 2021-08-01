import { origin } from "@open-fpl/app/features/Navigation/internalUrls";

// NOTE:
// 1. If you want to change this function name, please make sure to
//    change functionName in @open-fpl/app/scripts/make-og-images.ts as well
//    since it detects images to generate by this function name
// 2. Make sure to run `yarn make-og-images` if you add new Open Graph Images
//    in a new page.

const getOgImage = (path: string) => {
  return `${origin}/og-images/${path}`;
};

export default getOgImage;
