import { transparentize } from "@chakra-ui/theme-tools";

export type ColorCodes = Record<string, { bgColor: string; color: string }>;

export const difficultyColorCodes: (mode: string) => ColorCodes = (mode) => ({
  "1": {
    bgColor: `rgba(0, 111, 55, ${mode === "dark" ? 0.6 : 1})`,
    color: "white",
  },
  "2": {
    bgColor: `rgba(1, 252, 122, ${mode === "dark" ? 0.6 : 1})`,
    color: "black",
  },
  "3": {
    bgColor: `rgb(231, 231, 231, ${mode === "dark" ? 0.6 : 1})`,
    color: "black",
  },
  "4": {
    bgColor: `rgba(255, 23, 81, ${mode === "dark" ? 0.6 : 1})`,
    color: "white",
  },
  "5": {
    bgColor: `rgba(128, 7, 45, ${mode === "dark" ? 0.6 : 1})`,
    color: "white",
  },
});

export const positionColorCodes: (mode: string) => ColorCodes = (mode) => ({
  FWD: {
    bgColor: `rgba(233, 0, 82, ${mode === "dark" ? 0.6 : 1})`,
    color: "white",
  },
  MID: {
    bgColor: `rgb(5, 240, 255, ${mode === "dark" ? 0.6 : 1})`,
    color: "rgb(55, 0, 60)",
  },
  DEF: {
    bgColor: `rgb(0, 255, 135, ${mode === "dark" ? 0.6 : 1})`,
    color: "rgb(55, 0, 60)",
  },
  GKP: {
    bgColor: `rgb(235, 255, 0, ${mode === "dark" ? 0.6 : 1})`,
    color: "rgb(55, 0, 60)",
  },
});

export const statusColorCodes: (mode: string) => ColorCodes = (mode) => ({
  a: {
    bgColor: "transparent",
    color: "black",
  }, // Available
  d: {
    bgColor: mode === "dark" ? "yellow.200" : "yellow.300",
    color: "gray.700",
  }, // Injured but have chance to play
  i: {
    bgColor: mode === "dark" ? "red.300" : "red.500",
    color: mode === "dark" ? "gray.800" : "white",
  }, // Injured
  n: {
    bgColor: mode === "dark" ? "red.300" : "red.500",
    color: mode === "dark" ? "gray.800" : "white",
  }, // Ineligible to play (e.g. with parent club)
  s: {
    bgColor: mode === "dark" ? "red.300" : "red.500",
    color: mode === "dark" ? "gray.800" : "white",
  }, // Suspended
  u: {
    bgColor: mode === "dark" ? "red.300" : "red.500",
    color: mode === "dark" ? "gray.800" : "white",
  }, // Unavailable
});

export const teamColorCodes: (mode: string) => ColorCodes = (mode) => ({
  ARS: {
    bgColor: transparentize("#fe0102", mode === "dark" ? 0.6 : 1)({}),
    color: "#ffffff",
  },
  BRE: {
    bgColor: transparentize("#c61d23", mode === "dark" ? 0.6 : 1)({}),
    color: "#ffffff",
  },
  LIV: {
    bgColor: transparentize("#e31b23", mode === "dark" ? 0.6 : 1)({}),
    color: "#ff9065",
  },
  MUN: {
    bgColor: transparentize("#d81920", mode === "dark" ? 0.6 : 1)({}),
    color: "#ffe400",
  },
  SOU: {
    bgColor: transparentize("#d71920", mode === "dark" ? 0.6 : 1)({}),
    color: "#ffffff",
  },
  BUR: {
    bgColor: transparentize("#6a003a", mode === "dark" ? 0.6 : 1)({}),
    color: "#fff216",
  },
  WHU: {
    bgColor: transparentize("#7d2c3b", mode === "dark" ? 0.6 : 1)({}),
    color: "#ffffff",
  },

  CRY: {
    bgColor: transparentize("#1d3c93", mode === "dark" ? 0.6 : 1)({}),
    color: "#eb302e",
  },

  CHE: {
    bgColor: transparentize("#0a4495", mode === "dark" ? 0.6 : 1)({}),
    color: "#ffffff",
  },
  BHA: {
    bgColor: transparentize("#0054a6", mode === "dark" ? 0.6 : 1)({}),
    color: "#ffffff",
  },
  EVE: {
    bgColor: transparentize("#124080", mode === "dark" ? 0.6 : 1)({}), // 00369c
    color: "#ffffff",
  },
  LEI: {
    bgColor: transparentize("#0b56a4", mode === "dark" ? 0.6 : 1)({}), // 273e8a
    color: "#ffffff",
  },
  TOT: {
    bgColor: transparentize("#00164d", mode === "dark" ? 0.6 : 1)({}),
    color: "#ffffff",
  },

  LEE: {
    bgColor: transparentize("#084893", mode === "dark" ? 0.6 : 1)({}),
    color: "#f9ea02",
  },

  MCI: {
    bgColor: transparentize("#6caee0", mode === "dark" ? 0.6 : 1)({}),
    color: "#ffffff",
  },

  AVL: {
    bgColor: transparentize("#94bee5", mode === "dark" ? 0.6 : 1)({}),
    color: "#480025",
  },

  NEW: {
    bgColor: transparentize("#000000", mode === "dark" ? 0.6 : 1)({}),
    color: "#ffffff",
  },

  NOR: {
    bgColor: transparentize("#fff200", mode === "dark" ? 0.6 : 1)({}),
    color: "#00a651",
  },
  WAT: {
    bgColor: transparentize("#ffee02", mode === "dark" ? 0.6 : 1)({}),
    color: "#000000",
  },

  WOL: {
    bgColor: transparentize("#f9a01b", mode === "dark" ? 0.6 : 1)({}),
    color: "#000000",
  },
});
