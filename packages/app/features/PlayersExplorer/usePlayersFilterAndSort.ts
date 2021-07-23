import { ClientPlayer } from "@open-fpl/app/features/PlayerData/playerDataTypes";
import { SortOptions } from "@open-fpl/app/features/PlayersExplorer/playersExplorerTypes";
import { filterPlayers } from "@open-fpl/app/features/PlayersExplorer/playersSearchBarFilters";
import {
  filterOptions,
  sortOptions,
} from "@open-fpl/app/features/PlayersExplorer/playersToolbarOptions";
import { useSettings } from "@open-fpl/app/features/Settings/SettingsContext";
// @ts-ignore
import diacritics from "diacritics";
import Fuse from "fuse.js";
import { useCallback, useMemo, useState } from "react";
import searchQueryParser from "search-query-parser";
import { useDebounce } from "use-debounce";

const freeTextFuseSettings: Fuse.IFuseOptions<ClientPlayer> = {
  getFn: (player, path) => {
    if (path[0] === "$full_name") {
      return diacritics.remove(`${player.first_name} ${player.second_name}`);
    } else {
      // https://github.com/krisk/Fuse/issues/542
      const defaultGetFn = (Fuse as any).config
        .getFn as Fuse.FuseGetFunction<ClientPlayer>;
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
  players?: ClientPlayer[];
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
    () => new Fuse<ClientPlayer>(inputPlayers, freeTextFuseSettings),
    [inputPlayers]
  );

  const filterFn = useCallback(
    (inputPlayers: ClientPlayer[]) => {
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
    (inputPlayers: ClientPlayer[]) => {
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
