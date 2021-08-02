import { transparentize } from "@chakra-ui/theme-tools";
import { TeamColorCode } from "@open-fpl/app/features/TeamData/teamDataTypes";
import theme from "@open-fpl/common/theme";

export const assumedMax = {
  teamStrength: 1500,
};

export const assumedMin = {
  teamStrength: 1000,
};

export const getTeamsStrengthPercent = (strength: number): number =>
  (100 * (strength - assumedMin.teamStrength)) /
  (assumedMax.teamStrength - assumedMin.teamStrength);

export const teamColorCodes: (mode: string) => Record<string, TeamColorCode> = (
  mode
) => ({
  ARS: {
    bg: transparentize("#fe0102", mode === "dark" ? 0.6 : 1)(theme),
    color: "#ffffff",
  },
  BRE: {
    bg: transparentize("#c61d23", mode === "dark" ? 0.6 : 1)(theme),
    color: "#ffffff",
  },
  LIV: {
    bg: transparentize("#e31b23", mode === "dark" ? 0.6 : 1)(theme),
    color: "#ff9065",
  },
  MUN: {
    bg: transparentize("#d81920", mode === "dark" ? 0.6 : 1)(theme),
    color: "#ffe400",
  },
  SOU: {
    bg: transparentize("#d71920", mode === "dark" ? 0.6 : 1)(theme),
    color: "#ffffff",
  },
  BUR: {
    bg: transparentize("#6a003a", mode === "dark" ? 0.6 : 1)(theme),
    color: "#fff216",
  },
  WHU: {
    bg: transparentize("#7d2c3b", mode === "dark" ? 0.6 : 1)(theme),
    color: "#ffffff",
  },

  CRY: {
    bg: transparentize("#1d3c93", mode === "dark" ? 0.6 : 1)(theme),
    color: "#eb302e",
  },

  CHE: {
    bg: transparentize("#0a4495", mode === "dark" ? 0.6 : 1)(theme),
    color: "#ffffff",
  },
  BHA: {
    bg: transparentize("#0054a6", mode === "dark" ? 0.6 : 1)(theme),
    color: "#ffffff",
  },
  EVE: {
    bg: transparentize("#124080", mode === "dark" ? 0.6 : 1)(theme), // 00369c
    color: "#ffffff",
  },
  LEI: {
    bg: transparentize("#0b56a4", mode === "dark" ? 0.6 : 1)(theme), // 273e8a
    color: "#ffffff",
  },
  TOT: {
    bg: transparentize("#00164d", mode === "dark" ? 0.6 : 1)(theme),
    color: "#ffffff",
  },

  LEE: {
    bg: transparentize("#084893", mode === "dark" ? 0.6 : 1)(theme),
    color: "#f9ea02",
  },

  MCI: {
    bg: transparentize("#6caee0", mode === "dark" ? 0.6 : 1)(theme),
    color: "#ffffff",
  },

  AVL: {
    bg: transparentize("#94bee5", mode === "dark" ? 0.6 : 1)(theme),
    color: "#480025",
  },

  NEW: {
    bg: transparentize("#000000", mode === "dark" ? 0.6 : 1)(theme),
    color: "#ffffff",
  },

  NOR: {
    bg: transparentize("#fff200", mode === "dark" ? 0.6 : 1)(theme),
    color: "#00a651",
  },
  WAT: {
    bg: transparentize("#ffee02", mode === "dark" ? 0.6 : 1)(theme),
    color: "#000000",
  },

  WOL: {
    bg: transparentize("#f9a01b", mode === "dark" ? 0.6 : 1)(theme),
    color: "#000000",
  },
});
