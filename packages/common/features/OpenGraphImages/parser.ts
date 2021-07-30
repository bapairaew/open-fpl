import { ParsedRequest } from "@open-fpl/common/features/OpenGraphImages/openGraphImagestypes";
import fs from "fs";
import { URL } from "url";

export async function parseRequest(url: URL) {
  const { pathname, searchParams } = url;

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
    fontSize: fontSize || "192px",
    images: getArray(images),
    widths: getArray(widths),
    heights: getArray(heights),
  };

  parsedRequest.images = await getDefaultImages(parsedRequest.images);
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

async function getDefaultImages(images: string[]): Promise<string[]> {
  const defaultImage = `data:image/svg+xml;base64,${await fs.promises.readFile(
    "./public/logo.svg",
    {
      encoding: "base64",
    }
  )}`;

  if (!images || !images[0]) {
    return [defaultImage];
  }

  return images;
}
