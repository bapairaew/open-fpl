import {
  Box,
  Input,
  InputGroup,
  InputLeftElement,
  Select,
  Stack,
} from "@chakra-ui/react";
import diacritics from "diacritics";
import Fuse from "fuse.js";
import { useEffect, useMemo, useState } from "react";
import { IoSearchOutline } from "react-icons/io5";
import searchQueryParser from "search-query-parser";
import { useDebounce } from "use-debounce";
import {
  filterOptions,
  sortOptions,
} from "~/components/PlayersExplorer/playerSearchBarOptions";
import { filterPlayers } from "~/components/PlayersExplorer/playerSearchBarFilters";

const freeTextFuseSettings = {
  getFn: function getFn() {
    return diacritics.remove(Fuse.config.getFn.apply(this, arguments));
  },
  threshold: 0.2,
  keys: [
    {
      name: "name",
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
}) => {
  const [filterQuery, setFilterQuery] = useState(initialSeachQuery);
  const [debouncedFilterQuery] = useDebounce(filterQuery, 300);
  const [sort, setSort] = useState(sortOptions[0].value);

  const filterQueryObject = useMemo(() => {
    const filterQueryObject = searchQueryParser.parse(debouncedFilterQuery, {
      keywords: filterOptions.keywords.map((k) => k.field),
      ranges: filterOptions.ranges.map((k) => k.field),
    });
    return typeof filterQueryObject === "string"
      ? { text: filterQueryObject }
      : filterQueryObject;
  }, [debouncedFilterQuery]);

  const freeTextFuse = useMemo(
    () => new Fuse(inputPlayers, freeTextFuseSettings),
    [inputPlayers]
  );

  // Handle filtering and sorting
  useEffect(() => {
    const sortFn =
      sortOptions.find((o) => o.value === sort)?.sortFn ||
      sortOptions[0].sortFn;
    onResults(
      filterPlayers(
        inputPlayers,
        freeTextFuse,
        filterQueryObject,
        filterOptions
      ).sort(sortFn)
    );
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
      <Box>
        <Select
          flexBasis="220px"
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
