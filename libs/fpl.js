import fetch from "node-fetch";

export const getFPLData = () => {
  return fetch("https://fantasy.premierleague.com/api/bootstrap-static/", {
    headers: {
      "sec-ch-ua":
        '" Not A;Brand";v="99", "Chromium";v="90", "Google Chrome";v="90"',
      "sec-ch-ua-mobile": "?0",
      "User-Agent":
        "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/90.0.4430.93 Safari/537.36",
    },
    referrer: "https://fantasy.premierleague.com/transfers",
    referrerPolicy: "strict-origin-when-cross-origin",
    body: null,
    method: "GET",
    mode: "cors",
  })
    .then((r) => r.json())
    .then((j) => ({
      events: j.events,
      teams: j.teams,
      elements: j.elements.map((p) => ({
        ...p,
        element_type:
          j.element_types.find((e) => p.element_type === e.id) || null,
        name: `${p.first_name} ${p.second_name}`,
        team: j.teams.find((t) => p.team === t.id) || null,
      })),
    }));
};

export const getFPLPlayerSummaryData = (id) => {
  return fetch(`https://fantasy.premierleague.com/api/element-summary/${id}/`, {
    headers: {
      "sec-ch-ua":
        '" Not A;Brand";v="99", "Chromium";v="90", "Google Chrome";v="90"',
      "sec-ch-ua-mobile": "?0",
      "User-Agent":
        "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/90.0.4430.93 Safari/537.36",
    },
    referrer: "https://fantasy.premierleague.com/transfers",
    referrerPolicy: "strict-origin-when-cross-origin",
    body: null,
    method: "GET",
    mode: "cors",
  }).then((r) => r.json());
};

export const getTeam = (id) => {
  return fetch(`https://fantasy.premierleague.com/api/entry/${id}/`, {
    headers: {
      "sec-ch-ua":
        '" Not A;Brand";v="99", "Chromium";v="90", "Google Chrome";v="90"',
      "sec-ch-ua-mobile": "?0",
      "User-Agent":
        "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/90.0.4430.93 Safari/537.36",
    },
    referrer: "https://fantasy.premierleague.com/transfers",
    referrerPolicy: "strict-origin-when-cross-origin",
    body: null,
    method: "GET",
    mode: "cors",
  }).then((r) => r.json());
};

export const getTeamPicks = (id, event) => {
  return fetch(
    `https://fantasy.premierleague.com/api/entry/${id}/event/${event}/picks/`,
    {
      headers: {
        "sec-ch-ua":
          '" Not A;Brand";v="99", "Chromium";v="90", "Google Chrome";v="90"',
        "sec-ch-ua-mobile": "?0",
        "User-Agent":
          "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/90.0.4430.93 Safari/537.36",
      },
      referrer: "https://fantasy.premierleague.com/transfers",
      referrerPolicy: "strict-origin-when-cross-origin",
      body: null,
      method: "GET",
      mode: "cors",
    }
  ).then((r) => r.json());
};

export const getTeamTransfers = (id) => {
  return fetch(`https://fantasy.premierleague.com/api/entry/${id}/transfers/`, {
    headers: {
      "sec-ch-ua":
        '" Not A;Brand";v="99", "Chromium";v="90", "Google Chrome";v="90"',
      "sec-ch-ua-mobile": "?0",
      "User-Agent":
        "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/90.0.4430.93 Safari/537.36",
    },
    referrer: "https://fantasy.premierleague.com/transfers",
    referrerPolicy: "strict-origin-when-cross-origin",
    body: null,
    method: "GET",
    mode: "cors",
  }).then((r) => r.json());
};
