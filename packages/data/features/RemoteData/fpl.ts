import {
  Bootstrap,
  ElementSummary,
  Entry,
  EntryEvent,
  EntryHistory,
  Fixture,
  Live,
  Transfer,
} from "@open-fpl/data/features/RemoteData/fplTypes";
import fetch, { HeaderInit } from "node-fetch";

const headers = {
  "sec-ch-ua":
    '" Not A;Brand";v="99", "Chromium";v="90", "Google Chrome";v="90"',
  "sec-ch-ua-mobile": "?0",
  "User-Agent":
    "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/90.0.4430.93 Safari/537.36",
} as HeaderInit;

// TODO: handle response when the game is being updated (see getEntry/getEntryPicks)
export const getFPLData = (): Promise<Bootstrap> => {
  return fetch("https://fantasy.premierleague.com/api/bootstrap-static/", {
    headers,
    method: "GET",
  }).then((r) => r.json());
};

// TODO: handle response when the game is being updated (see getEntry/getEntryPicks)
export const getFPLPlayerSummaryData = (
  id: number
): Promise<ElementSummary> => {
  return fetch(`https://fantasy.premierleague.com/api/element-summary/${id}/`, {
    headers,
    method: "GET",
  }).then((r) => r.json());
};

export const getEntry = (id: number): Promise<Entry | string> => {
  return fetch(`https://fantasy.premierleague.com/api/entry/${id}/`, {
    headers,
    method: "GET",
  })
    .then((response) => response.text())
    .then((text) => {
      try {
        const data = JSON.parse(text);
        if (data.detail) return data.detail;
        return data;
      } catch (err) {
        return text;
      }
    });
};

export const getEntryPicks = (
  id: number,
  event: number
): Promise<EntryEvent | string> => {
  return fetch(
    `https://fantasy.premierleague.com/api/entry/${id}/event/${event}/picks/`,
    {
      headers,
      method: "GET",
    }
  )
    .then((response) => response.text())
    .then((text) => {
      try {
        const data = JSON.parse(text);
        if (data.detail) return data.detail;
        return data;
      } catch (err) {
        return text;
      }
    });
};

export const getEntryHistory = (id: number): Promise<EntryHistory | string> => {
  return fetch(`https://fantasy.premierleague.com/api/entry/${id}/history/`, {
    headers,
    method: "GET",
  })
    .then((response) => response.text())
    .then((text) => {
      try {
        const data = JSON.parse(text);
        if (data.detail) return data.detail;
        return data;
      } catch (err) {
        return text;
      }
    });
};

// TODO: handle response when the game is being updated (see getEntry/getEntryPicks)
export const getEntryTransfers = (id: number): Promise<Transfer[]> => {
  return fetch(`https://fantasy.premierleague.com/api/entry/${id}/transfers/`, {
    headers,
    method: "GET",
  }).then((r) => r.json());
};

// TODO: handle response when the game is being updated (see getEntry/getEntryPicks)
export const getFixtures = (event: number): Promise<Fixture[]> => {
  return fetch(
    `https://fantasy.premierleague.com/api/fixtures/?event=${event}`,
    {
      headers,
      method: "GET",
    }
  ).then((r) => r.json());
};

// TODO: handle response when the game is being updated (see getEntry/getEntryPicks)
export const getLiveEvent = (event: number): Promise<Live> => {
  return fetch(`https://fantasy.premierleague.com/api/event/${event}/live/`, {
    headers,
    method: "GET",
  }).then((r) => r.json());
};
