import { IncomingMessage } from "http";
import { URL } from "url";
import { ParsedRequest } from "~/features/OpenGraphImages/openGraphImagestypes";
import { baseUrl } from "~/features/Navigation/internalUrls";

export function parseRequest(req: IncomingMessage) {
  const { pathname, searchParams } = new URL(req.url || "/", baseUrl);

  const fontSize = searchParams.get("fontSize");
  const images = searchParams.getAll("images");
  const widths = searchParams.getAll("widths");
  const heights = searchParams.getAll("heights");
  const md = searchParams.get("md");

  if (Array.isArray(fontSize)) {
    throw new Error("Expected a single fontSize");
  }

  const arr = (pathname.split("/").pop() || "/").split(".");
  let extension = "";
  let text = "";
  if (arr.length === 0) {
    text = "";
  } else if (arr.length === 1) {
    text = arr[0];
  } else {
    extension = arr.pop() as string;
    text = arr.join(".");
  }

  const parsedRequest: ParsedRequest = {
    fileType: extension === "jpeg" ? extension : "png",
    text: decodeURIComponent(text),
    md: md === "1" || md === "true",
    fontSize: fontSize || "96px",
    images: getArray(images),
    widths: getArray(widths),
    heights: getArray(heights),
  };

  parsedRequest.images = getDefaultImages(parsedRequest.images);
  return parsedRequest;
}

function getArray(stringOrArray: string[] | string | undefined): string[] {
  if (typeof stringOrArray === "undefined") {
    return [];
  } else if (Array.isArray(stringOrArray)) {
    return stringOrArray;
  } else {
    return [stringOrArray];
  }
}

function getDefaultImages(images: string[]): string[] {
  const defaultImage = `${baseUrl}/logo.svg`;

  if (!images || !images[0]) {
    return [defaultImage];
  }

  if (!images[0].startsWith(baseUrl)) {
    images[0] = defaultImage;
  }

  return images;
}
