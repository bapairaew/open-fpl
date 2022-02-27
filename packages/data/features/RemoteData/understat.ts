import {
  GetUnderstatPlayersResponse,
  LeagueStat,
  PageTeamStat,
  PlayerStat,
} from "@open-fpl/data/features/RemoteData/understatTypes";
import fetch from "node-fetch";
import { HTMLElement, parse } from "node-html-parser";

const { UNDERSTAT_SEASON: _understatSeason } = process.env;
const understatSeason = _understatSeason ?? "2021";

const headers = {
  accept: "application/json, text/javascript, */*; q=0.01",
  "accept-language": "en,th;q=0.9",
  "content-type": "application/x-www-form-urlencoded; charset=UTF-8",
  "sec-ch-ua":
    '" Not A;Brand";v="99", "Chromium";v="90", "Google Chrome";v="90"',
  "sec-ch-ua-mobile": "?0",
  "sec-fetch-dest": "empty",
  "sec-fetch-mode": "cors",
  "sec-fetch-site": "same-origin",
  "x-requested-with": "XMLHttpRequest",
};

export const getUnderstatPlayers = (
  season: string = understatSeason
): Promise<GetUnderstatPlayersResponse> => {
  return fetch("https://understat.com/main/getPlayersStats/", {
    headers,
    body: `league=EPL&season=${season}`,
    method: "POST",
  }).then((r) => r.json());
};

function getDataFromScripts<T>(scripts: HTMLElement[]): T {
  return scripts
    .map((s) =>
      s.textContent.match(/([a-zA-Z_][a-zA-Z0-9_]*)\s*=\s*JSON.parse\('(.*)'\)/)
    )
    .reduce((data, match) => {
      if (match) {
        const [, name, value] = match;
        // @ts-ignore
        data[name] = JSON.parse(
          value.replace(/\\x([0-9a-f]{2})/gi, function (_, pair) {
            return String.fromCharCode(parseInt(pair, 16));
          })
        );
      }
      return data;
    }, {} as T);
}

export const getUnderstatPlayerData = (id: string): Promise<PlayerStat> => {
  return fetch(`https://understat.com/player/${id}`, {
    headers,
    method: "GET",
  })
    .then((r) => r.text())
    .then((t) => {
      const scripts = parse(t).querySelectorAll(".block script");
      return getDataFromScripts<PlayerStat>(scripts);
    });
};

// NOTE: This is only used for getting team ID, extend this type later if other data is needed
export const getUnderstatData = (): Promise<LeagueStat> => {
  return fetch(`https://understat.com/league/EPL`, {
    headers,
    method: "GET",
  })
    .then((r) => r.text())
    .then((t) => {
      const scripts = parse(t).querySelectorAll(".block script");
      return getDataFromScripts<LeagueStat>(scripts);
    });
};

export const getUnderstatTeamData = (slug: string): Promise<PageTeamStat> => {
  return fetch(`https://understat.com/team/${slug}`, {
    headers,
    method: "GET",
  })
    .then((r) => r.text())
    .then((t) => {
      const scripts = parse(t).querySelectorAll(".block script");
      return getDataFromScripts<PageTeamStat>(scripts);
    });
};
