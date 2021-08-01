import { TeamColorCode } from "@open-fpl/app/features/TeamData/teamDataTypes";

export const assumedMax = {
  teamStrength: 1500,
};

export const assumedMin = {
  teamStrength: 1000,
};

export const getTeamsStrengthPercent = (strength: number): number =>
  (100 * (strength - assumedMin.teamStrength)) /
  (assumedMax.teamStrength - assumedMin.teamStrength);

export const teamColorCodes: Record<string, TeamColorCode> = {
  ARS: {
    bg: "#fe0102",
    color: "#ffffff",
  },
  BRE: {
    bg: "#c61d23",
    color: "#ffffff",
  },
  LIV: {
    bg: "#e31b23",
    color: "#ff9065",
  },
  MUN: {
    bg: "#d81920",
    color: "#ffe400",
  },
  SOU: {
    bg: "#d71920",
    color: "#ffffff",
  },
  BUR: {
    bg: "#6a003a",
    color: "#fff216",
  },
  WHU: {
    bg: "#7d2c3b",
    color: "#ffffff",
  },

  CRY: {
    bg: "#1d3c93",
    color: "#eb302e",
  },

  CHE: {
    bg: "#0a4495",
    color: "#ffffff",
  },
  BHA: {
    bg: "#0054a6",
    color: "#ffffff",
  },
  EVE: {
    bg: "#124080", // 00369c
    color: "#ffffff",
  },
  LEI: {
    bg: "#0b56a4", // 273e8a
    color: "#ffffff",
  },
  TOT: {
    bg: "#00164d",
    color: "#ffffff",
  },

  LEE: {
    bg: "#084893",
    color: "#f9ea02",
  },

  MCI: {
    bg: "#6caee0",
    color: "#ffffff",
  },

  AVL: {
    bg: "#94bee5",
    color: "#480025",
  },

  NEW: {
    bg: "#000000",
    color: "#ffffff",
  },

  NOR: {
    bg: "#fff200",
    color: "#00a651",
  },
  WAT: {
    bg: "#ffee02",
    color: "#000000",
  },

  WOL: {
    bg: "#f9a01b",
    color: "#000000",
  },
};
