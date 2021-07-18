import { ElementStatus } from "@open-fpl/data/features/RemoteData/fplTypes";

export const difficultyColorCodes: Record<
  number,
  { background: string; text: string }
> = {
  1: {
    background: "rgb(0, 111, 55)",
    text: "white",
  },
  2: {
    background: "rgb(1, 252, 122)",
    text: "black",
  },
  3: {
    background: "rgb(231, 231, 231)",
    text: "black",
  },
  4: {
    background: "rgb(255, 23, 81)",
    text: "white",
  },
  5: {
    background: "rgb(128, 7, 45)",
    text: "white",
  },
};

export const positionColorCodes: Record<
  string,
  { background: string; text: string }
> = {
  FWD: {
    background: "rgb(233, 0, 82)",
    text: "white",
  },
  MID: {
    background: "rgb(5, 240, 255)",
    text: "rgb(55, 0, 60)",
  },
  DEF: {
    background: "rgb(0, 255, 135)",
    text: "rgb(55, 0, 60)",
  },
  GKP: {
    background: "rgb(235, 255, 0)",
    text: "rgb(55, 0, 60)",
  },
};

export const statusColorCodes: Record<ElementStatus, string> = {
  a: "transparent", // Available
  d: "yellow", // Injured but have chance to play
  i: "red", // Injured
  n: "red", // Ineligible to play (e.g. with parent club)
  s: "red", // Suspended
  u: "red", // Unavailable
};

export const deltaColorCodes: Record<
  "positive" | "neutral" | "negative",
  { background: string; text: string }
> = {
  positive: {
    background: "rgb(1, 252, 122)",
    text: "black",
  },
  neutral: {
    background: "rgb(231, 231, 231)",
    text: "black",
  },
  negative: {
    background: "rgb(255, 23, 81)",
    text: "white",
  },
};
