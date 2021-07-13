import fetch, { HeaderInit } from "node-fetch";
import {
  Bootstrap,
  ElementSummary,
  EntryEvent,
  EntryHistory,
  Team,
  Transfer,
} from "~/features/RemoteData/fplTypes";

const headers = {
  "sec-ch-ua":
    '" Not A;Brand";v="99", "Chromium";v="90", "Google Chrome";v="90"',
  "sec-ch-ua-mobile": "?0",
  "User-Agent":
    "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/90.0.4430.93 Safari/537.36",
} as HeaderInit;

export const getFPLData = (): Promise<Bootstrap> => {
  return fetch("https://fantasy.premierleague.com/api/bootstrap-static/", {
    headers,
    method: "GET",
  }).then((r) => r.json());
};

export const getFPLPlayerSummaryData = (
  id: number
): Promise<ElementSummary> => {
  return fetch(`https://fantasy.premierleague.com/api/element-summary/${id}/`, {
    headers,
    method: "GET",
  }).then((r) => r.json());
};

export const getTeam = (id: number): Promise<Team> => {
  return fetch(`https://fantasy.premierleague.com/api/entry/${id}/`, {
    headers,
    method: "GET",
  }).then((r) => r.json());
};

export const getTeamPicks = (
  id: number,
  event: number
): Promise<EntryEvent> => {
  return fetch(
    `https://fantasy.premierleague.com/api/entry/${id}/event/${event}/picks/`,
    {
      headers,
      method: "GET",
    }
  ).then((r) => r.json());
};

export const getTeamTransfers = (id: number): Promise<Transfer[]> => {
  return fetch(`https://fantasy.premierleague.com/api/entry/${id}/transfers/`, {
    headers,
    method: "GET",
  }).then((r) => r.json());
};

export const getTeamHistory = (id: number): Promise<EntryHistory> => {
  return fetch(`https://fantasy.premierleague.com/api/entry/${id}/history/`, {
    headers,
    method: "GET",
  }).then((r) => r.json());
};
