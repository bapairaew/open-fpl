// @ts-ignore
import diacritics from "diacritics";
import Fuse from "fuse.js";
import { useEffect, useMemo, useState } from "react";
import searchQueryParser from "search-query-parser";
import { useDebounce } from "use-debounce";
import { Player } from "~/features/AppData/appDataTypes";
import { filterPlayers } from "~/features/PlayersExplorer/playerSearchBarFilters";
import {
  filterOptions,
  sortOptions,
} from "~/features/PlayersExplorer/playersToolbarOptions";

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

const usePlayersToolbar = ({
  initialSeachQuery = "",
  players: inputPlayers = [],
  onResults = () => {},
}: {
  initialSeachQuery?: string;
  players?: Player[];
  onResults?: (players: Player[]) => void;
}) => {
  const [filterQuery, setFilterQuery] = useState(initialSeachQuery);
  const [debouncedFilterQuery] = useDebounce(filterQuery, 300);
  const [sort, setSort] = useState(sortOptions[0].value);

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

  // Handle filtering and sorting
  useEffect(() => {
    const sortFn =
      sortOptions.find((o) => o.value === sort)?.sortFn ||
      sortOptions[0].sortFn;
    const processedPlayers = filterPlayers(
      inputPlayers,
      freeTextFuse,
      filterQueryObject,
      filterOptions
    ).sort(sortFn);
    onResults(processedPlayers);
  }, [inputPlayers, filterQueryObject, sort]);

  return { filterQuery, setFilterQuery, sort, setSort };
};

export default usePlayersToolbar;
