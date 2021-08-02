import { ElementStatus } from "@open-fpl/data/features/RemoteData/fplTypes";

export const difficultyColorCodes: (
  mode: string
) => Record<number, { background: string; text: string }> = (mode) => ({
  1: {
    background: `rgba(0, 111, 55, ${mode === "dark" ? 0.6 : 1})`,
    text: "white",
  },
  2: {
    background: `rgba(1, 252, 122, ${mode === "dark" ? 0.6 : 1})`,
    text: "black",
  },
  3: {
    background: `rgb(231, 231, 231, ${mode === "dark" ? 0.6 : 1})`,
    text: "black",
  },
  4: {
    background: `rgba(255, 23, 81, ${mode === "dark" ? 0.6 : 1})`,
    text: "white",
  },
  5: {
    background: `rgba(128, 7, 45, ${mode === "dark" ? 0.6 : 1})`,
    text: "white",
  },
});

export const positionColorCodes: (
  mode: string
) => Record<string, { background: string; text: string }> = (mode) => ({
  FWD: {
    background: `rgba(233, 0, 82, ${mode === "dark" ? 0.6 : 1})`,
    text: "white",
  },
  MID: {
    background: `rgb(5, 240, 255, ${mode === "dark" ? 0.6 : 1})`,
    text: "rgb(55, 0, 60)",
  },
  DEF: {
    background: `rgb(0, 255, 135, ${mode === "dark" ? 0.6 : 1})`,
    text: "rgb(55, 0, 60)",
  },
  GKP: {
    background: `rgb(235, 255, 0, ${mode === "dark" ? 0.6 : 1})`,
    text: "rgb(55, 0, 60)",
  },
});

export const statusColorCodes: (
  mode: string
) => Record<ElementStatus, { bg: string; color: string }> = (mode) => ({
  a: {
    bg: "transparent",
    color: "black",
  }, // Available
  d: {
    bg: mode === "dark" ? "yellow.200" : "yellow.300",
    color: "gray.700",
  }, // Injured but have chance to play
  i: {
    bg: mode === "dark" ? "red.300" : "red.500",
    color: mode === "dark" ? "gray.800" : "white",
  }, // Injured
  n: {
    bg: mode === "dark" ? "red.300" : "red.500",
    color: mode === "dark" ? "gray.800" : "white",
  }, // Ineligible to play (e.g. with parent club)
  s: {
    bg: mode === "dark" ? "red.300" : "red.500",
    color: mode === "dark" ? "gray.800" : "white",
  }, // Suspended
  u: {
    bg: mode === "dark" ? "red.300" : "red.500",
    color: mode === "dark" ? "gray.800" : "white",
  }, // Unavailable
});
