import fetch from "node-fetch";
import { parse } from "node-html-parser";
import { TeamColorCodes } from "@open-fpl/data/features/RemoteData/teamcolorcodesTypes";

// node-html-parser does not parse `element.style`
// TODO: find a better way to extract color
const getStyleValue = (parts: string[], indicator: string): string | null => {
  const index = parts.findIndex((x) => x === indicator);
  return index === -1 ? null : parts[index + 1]?.replace(/;/, "");
};

export const getTeamColorCodes = (): Promise<TeamColorCodes[]> => {
  return fetch(
    `https://teamcolorcodes.com/soccer/premier-league-color-codes/`,
    {
      headers: {
        accept:
          "text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.9",
        "accept-language": "en,th;q=0.9",
        "sec-ch-ua":
          '" Not A;Brand";v="99", "Chromium";v="90", "Google Chrome";v="90"',
        "sec-ch-ua-mobile": "?0",
        "sec-fetch-dest": "document",
        "sec-fetch-mode": "navigate",
        "sec-fetch-site": "same-origin",
        "sec-fetch-user": "?1",
        "upgrade-insecure-requests": "1",
      },
      method: "GET",
    }
  )
    .then((r) => r.text())
    .then((t) => {
      return parse(t)
        .querySelectorAll(".team-button")
        .map((t) => {
          const parts = t.attributes.style.split(" ");
          return {
            team: t.textContent,
            background: getStyleValue(parts, "background-color:"),
            text: getStyleValue(parts, "color:"),
            highlight: getStyleValue(parts, "solid"),
          };
        });
    });
};
