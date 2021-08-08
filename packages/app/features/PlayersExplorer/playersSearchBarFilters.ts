import { ClientPlayer } from "@open-fpl/app/features/PlayerData/playerDataTypes";
import { FilterOptions } from "@open-fpl/app/features/PlayersExplorer/playersExplorerTypes";
// @ts-ignore
import diacritics from "diacritics";
import Fuse from "fuse.js";
import { SearchParserResult } from "search-query-parser";

interface FilterParams {
  players: ClientPlayer[];
  filterValue: string | string[];
  getFieldValue?: (player: ClientPlayer) => any;
}

const includeFilter = ({
  players,
  filterValue,
  getFieldValue,
}: FilterParams) => {
  return players.filter((p) => {
    const fieldValue: string = getFieldValue?.(p);
    return typeof filterValue === "string"
      ? fieldValue.toLowerCase() === filterValue.toLowerCase()
      : filterValue.some(
          (value) => fieldValue.toLowerCase() === value.toLowerCase()
        );
  });
};

const excludeFilter = ({
  players,
  filterValue,
  getFieldValue,
}: FilterParams) => {
  return players.filter((p) => {
    const fieldValue: string = getFieldValue?.(p);
    return typeof filterValue === "string"
      ? fieldValue.toLowerCase() !== filterValue.toLowerCase()
      : filterValue.every(
          (value) => fieldValue.toLowerCase() !== value.toLowerCase()
        );
  });
};

export const filterPlayers = (
  inputPlayers: ClientPlayer[],
  freeTextFuse: Fuse<ClientPlayer>,
  filterQueryObject: string | SearchParserResult,
  filterOptions: FilterOptions
): ClientPlayer[] => {
  if (typeof filterQueryObject === "string") {
    return filterQueryObject
      ? freeTextFuse
          .search(diacritics.remove(filterQueryObject))
          .map((r) => r.item)
      : [...inputPlayers];
  } else {
    let players = [...inputPlayers];
    for (const keyword of filterOptions.keywords) {
      if (filterQueryObject[keyword.field]) {
        players = includeFilter({
          players,
          filterValue: filterQueryObject[keyword.field],
          getFieldValue: filterOptions.keywords.find(
            (o) => o.field === keyword.field
          )?.getFieldValue,
        });
      }
    }

    if (filterQueryObject.exclude) {
      for (const keyword of filterOptions.keywords) {
        if (filterQueryObject.exclude[keyword.field]) {
          players = excludeFilter({
            players,
            filterValue: filterQueryObject.exclude[keyword.field],
            getFieldValue: filterOptions.keywords.find(
              (o) => o.field === keyword.field
            )?.getFieldValue,
          });
        }
      }
    }

    // Range search does not support exclusion
    for (const range of filterOptions.ranges) {
      if (filterQueryObject[range.field]) {
        const getFieldValue = filterOptions.ranges.find(
          (r) => r.field === range.field
        )?.getFieldValue;
        players = players.filter((p) => {
          const value: number | undefined = getFieldValue?.(p);
          if (value === undefined) return false;
          const { from, to }: { from: string; to: string } =
            filterQueryObject[range.field];
          if (from.startsWith(">=")) {
            return value >= +from.substr(2);
          } else if (from.startsWith("<=")) {
            return value <= +from.substr(2);
          } else if (from.startsWith(">")) {
            return value > +from.substr(1);
          } else if (from.startsWith("<")) {
            return value < +from.substr(1);
          }
          return to ? value >= +from && value <= +to : value === +from;
        });
      }
    }
    return players;
  }
};
