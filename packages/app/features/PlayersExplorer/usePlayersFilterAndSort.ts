// @ts-ignore
import diacritics from "diacritics";
import Fuse from "fuse.js";
import { useCallback, useMemo, useState } from "react";
import searchQueryParser from "search-query-parser";
import { useDebounce } from "use-debounce";
import { Player } from "@open-fpl/data/features/AppData/playerDataTypes";
import { filterPlayers } from "@open-fpl/app/features/PlayersExplorer/playersSearchBarFilters";
import {
  filterOptions,
  sortOptions,
} from "@open-fpl/app/features/PlayersExplorer/playersToolbarOptions";
import { useSettings } from "@open-fpl/app/features/Settings/SettingsContext";
import { SortOptions } from "@open-fpl/app/features/PlayersExplorer/playersExplorerTypes";

const freeTextFuseSettings: Fuse.IFuseOptions<Player> = {
  getFn: (player, path) => {
    if (path[0] === "$full_name") {
      return diacritics.remove(`${player.first_name} ${player.second_name}`);
    } else {
      // https://github.com/krisk/Fuse/issues/542
      const defaultGetFn = (Fuse as any).config
        .getFn as Fuse.FuseGetFunction<Player>;
      return diacritics.remove(defaultGetFn(player, path));
    }
  },
  threshold: 0.3,
  keys: [
    {
      name: "$full_name",
      weight: 0.3,
    },
    {
      name: "web_name",
      weight: 0.7,
    },
  ],
};

const usePlayersFilterAndSort = ({
  initialSeachQuery = "",
  players: inputPlayers = [],
}: {
  initialSeachQuery?: string;
  players?: Player[];
}) => {
  const { playersExplorerSortOption, setPlayersExplorerSortOption } =
    useSettings();
  const [filterQuery, setFilterQuery] = useState(initialSeachQuery);
  const [debouncedFilterQuery] = useDebounce(filterQuery, 300);

  const sort = playersExplorerSortOption ?? sortOptions[0].value;
  const setSort = useCallback(
    (value: string) => {
      setPlayersExplorerSortOption(value as SortOptions);
    },
    [playersExplorerSortOption]
  );

  const filterQueryObject = useMemo(() => {
    const filterQueryObject = searchQueryParser.parse(debouncedFilterQuery, {
      keywords: filterOptions.keywords.map((k) => k.field),
      ranges: filterOptions.ranges.map((k) => k.field),
    });
    return filterQueryObject;
  }, [debouncedFilterQuery]);

  const freeTextFuse = useMemo(
    () => new Fuse<Player>(inputPlayers, freeTextFuseSettings),
    [inputPlayers]
  );

  const filterFn = useCallback(
    (inputPlayers: Player[]) => {
      return filterPlayers(
        inputPlayers,
        freeTextFuse,
        filterQueryObject,
        filterOptions
      );
    },
    [freeTextFuse, filterQueryObject, freeTextFuse]
  );

  const sortFn = useCallback(() => {
    return sortOptions.find((o) => o.value === sort)?.sortFn!;
  }, [sortOptions, sort]);

  const fiterThenSortFn = useCallback(
    (inputPlayers: Player[]) => {
      const sortFn = sortOptions.find((o) => o.value === sort)?.sortFn!;
      return filterPlayers(
        inputPlayers,
        freeTextFuse,
        filterQueryObject,
        filterOptions
      ).sort(sortFn);
    },
    [filterFn, sortFn]
  );

  return {
    filterQuery,
    setFilterQuery,
    sort,
    setSort,
    filterFn,
    sortFn,
    fiterThenSortFn,
  };
};

export default usePlayersFilterAndSort;
