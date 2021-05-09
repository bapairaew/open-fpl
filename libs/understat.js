import fetch from "node-fetch";
import { parse } from "node-html-parser";

export const getUnderstatPlayers = () => {
  return fetch("https://understat.com/main/getPlayersStats/", {
    headers: {
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
    },
    referrer: "https://understat.com/league/EPL",
    referrerPolicy: "strict-origin-when-cross-origin",
    body: "league=EPL&season=2020",
    method: "POST",
    mode: "cors",
  })
    .then((r) => r.json())
    .then((j) =>
      j.response?.players.map((p) => ({
        ...p,
        teams: p.team_title.split(","),
      }))
    );
};

function getDataFromScripts(scripts) {
  return scripts
    .map((s) =>
      s.textContent.match(/([a-zA-Z_][a-zA-Z0-9_]*)\s*=\s*JSON.parse\('(.*)'\)/)
    )
    .reduce(
      (obj, match) => ({
        ...obj,
        [match[1]]: JSON.parse(
          match[2].replace(/\\x([0-9a-f]{2})/gi, function (_, pair) {
            return String.fromCharCode(parseInt(pair, 16));
          })
        ),
      }),
      {}
    );
}

export const getUnderstatPlayerData = (id) => {
  return fetch(`https://understat.com/player/${id}`, {
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
    referrer: "https://understat.com/league/EPL/2020",
    referrerPolicy: "strict-origin-when-cross-origin",
    body: null,
    method: "GET",
    mode: "cors",
  })
    .then((r) => r.text())
    .then((t) => {
      const scripts = parse(t).querySelectorAll(".block script");
      return getDataFromScripts(scripts);
    });
};

export const getUnderstatData = () => {
  return fetch(`https://understat.com/league/EPL`, {
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
    referrerPolicy: "strict-origin-when-cross-origin",
    body: null,
    method: "GET",
    mode: "cors",
  })
    .then((r) => r.text())
    .then((t) => {
      const scripts = parse(t).querySelectorAll(".block script");
      return getDataFromScripts(scripts);
    });
};

export const getUnderstatTeamData = (id) => {
  return fetch(`https://understat.com/team/${id}`, {
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
    referrerPolicy: "strict-origin-when-cross-origin",
    body: null,
    method: "GET",
    mode: "cors",
  })
    .then((r) => r.text())
    .then((t) => {
      const scripts = parse(t).querySelectorAll(".block script");
      return getDataFromScripts(scripts);
    });
};
