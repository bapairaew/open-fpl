import {
  Box,
  Input,
  InputGroup,
  InputLeftElement,
  Select,
  Stack,
  StackDirection,
} from "@chakra-ui/react";
// @ts-ignore
import diacritics from "diacritics";
import Fuse from "fuse.js";
import { useEffect, useMemo, useState } from "react";
import { IoSearchOutline } from "react-icons/io5";
import searchQueryParser from "search-query-parser";
import { useDebounce } from "use-debounce";
import { filterPlayers } from "~/features/PlayersExplorer/playerSearchBarFilters";
import {
  filterOptions,
  sortOptions,
} from "~/features/PlayersExplorer/playerSearchBarOptions";
import { Player } from "~/features/AppData/appDataTypes";

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

const PlayerSearchBar = ({
  direction = "row",
  initialSeachQuery = "",
  onResults = () => {},
  players: inputPlayers = [],
}: {
  direction?: StackDirection;
  initialSeachQuery?: string;
  onResults?: (players: Player[]) => void;
  players?: Player[];
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

  return (
    <Stack direction={direction} spacing={2}>
      <InputGroup variant="filled">
        <InputLeftElement pointerEvents="none" children={<IoSearchOutline />} />
        <Input
          placeholder="Search"
          value={filterQuery}
          onChange={(e) => setFilterQuery(e.target.value)}
        />
      </InputGroup>
      <Box flexShrink={0}>
        <Select
          variant="filled"
          value={sort}
          onChange={(e) => setSort(e.target.value)}
        >
          {sortOptions.map((o) => (
            <option key={o.value} value={o.value}>
              {o.label}
            </option>
          ))}
        </Select>
      </Box>
    </Stack>
  );
};

export default PlayerSearchBar;
