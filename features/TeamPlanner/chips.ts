import { ChipName } from "~/features/RemoteData/fplTypes";

export const getChipDisplayName = (chip: ChipName): string => {
  switch (chip) {
    case "3xc":
      return "Triple Captain";
    case "bboost":
      return "Bench Boost";
    case "freehit":
      return "Free Hit";
    case "wildcard":
      return "Wildcard";
    default:
      return "Unknown Chip";
  }
};
