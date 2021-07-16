import { baseUrl } from "~/features/Navigation/internalUrls";

const getOgImage = (path: string) => {
  return `${baseUrl}/og-images/${path}`;
};

export default getOgImage;
