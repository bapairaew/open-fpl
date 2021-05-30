import {
  Flex,
  Input,
  InputGroup,
  InputLeftElement,
  Select,
  Spacer,
  Stack,
  Box,
} from "@chakra-ui/react";
import diacritics from "diacritics";
import Fuse from "fuse.js";
import { useEffect, useMemo, useState } from "react";
import { IoSearchOutline } from "react-icons/io5";
import searchQueryParser from "search-query-parser";
import { useDebounce } from "use-debounce";
import { isNullOrUndefined } from "~/libs/datatype";

const filterOptions = {
  keywords: [
    { field: "id", getFieldValue: (p) => `${p.id}` },
    { field: "name", getFieldValue: (p) => p.web_name },
    { field: "team", getFieldValue: (p) => p.team.short_name },
    {
      field: "position",
      getFieldValue: (p) => p.element_type.singular_name_short,
    },
  ],
  ranges: [{ field: "cost", getFieldValue: (p) => p.now_cost / 10 }],
};

const sortOptions = [
  {
    label: "Best fixtures",
    value: "best-fixtures",
    sortFn: (a, b) => {
      // Sort reversed difficulty value (5 is better than 1), and sum them all which makes the value the more the better (more matches and easier)
      const sumA = a.linked_data.next_gameweeks.reduce(
        (s, g) => s + (5 - g.difficulty),
        0
      );
      const sumB = b.linked_data.next_gameweeks.reduce(
        (s, g) => s + (5 - g.difficulty),
        0
      );
      return sumA === sumB
        ? a.team.short_name.localeCompare(b.team.short_name) // Make sure same team is group together in the result
        : sumA > sumB
        ? -1
        : 1;
    },
  },
  {
    label: "Best recent xGI",
    value: "best-xgi",
    sortFn: (a, b) => {
      if (
        !a.linked_data.past_matches ||
        a.linked_data.past_matches.filter(
          (m) => !isNullOrUndefined(m.match_xgi)
        ).length < 5
      )
        return 1;
      if (
        !b.linked_data.past_matches ||
        b.linked_data.past_matches.filter(
          (m) => !isNullOrUndefined(m.match_xgi)
        ).length < 5
      )
        return -1;
      const sumA = a.linked_data.past_matches.reduce(
        (sum, m) => m.match_xgi + sum,
        0
      );
      const sumB = b.linked_data.past_matches.reduce(
        (sum, m) => m.match_xgi + sum,
        0
      );
      if (sumA < sumB) return 1;
      if (sumA > sumB) return -1;
      return 0;
    },
  },
  {
    label: "Best recent xGA",
    value: "best-xga",
    sortFn: (a, b) => {
      if (
        !a.linked_data.past_matches ||
        a.linked_data.past_matches.filter(
          (m) => !isNullOrUndefined(m.match_xga)
        ).length < 5
      )
        return 1;
      if (
        !b.linked_data.past_matches ||
        b.linked_data.past_matches.filter(
          (m) => !isNullOrUndefined(m.match_xga)
        ).length < 5
      )
        return -1;
      const sumA = a.linked_data.past_matches.reduce(
        (sum, m) => m.match_xga + sum,
        0
      );
      const sumB = b.linked_data.past_matches.reduce(
        (sum, m) => m.match_xga + sum,
        0
      );
      if (sumA < sumB) return -1;
      if (sumA > sumB) return 1;
      return 0;
    },
  },
  {
    label: "Price: low to high",
    value: "price-asc",
    sortFn: (a, b) => (a.now_cost < b.now_cost ? -1 : 1),
  },
  {
    label: "Price: high to low",
    value: "price-desc",
    sortFn: (a, b) => (a.now_cost > b.now_cost ? -1 : 1),
  },
  {
    label: "Ownership gain",
    value: "transfers-delta-desc",
    sortFn: (a, b) =>
      a.linked_data.transfers_delta_event > b.linked_data.transfers_delta_event
        ? -1
        : 1,
  },
  {
    label: "Ownership loss",
    value: "transfers-delta-asc",
    sortFn: (a, b) =>
      a.linked_data.transfers_delta_event < b.linked_data.transfers_delta_event
        ? -1
        : 1,
  },
];

const includeFilter = ({ players, filterValue, getFieldValue }) => {
  return players.filter((p) => {
    const fieldValue = getFieldValue?.(p);
    return typeof filterValue === "string"
      ? fieldValue.toLowerCase() === filterValue.toLowerCase()
      : filterValue.some(
          (value) => fieldValue.toLowerCase() === value.toLowerCase()
        );
  });
};

const excludeFilter = ({ players, filterValue, getFieldValue }) => {
  return players.filter((p) => {
    const fieldValue = getFieldValue?.(p);
    return typeof filterValue === "string"
      ? fieldValue.toLowerCase() !== filterValue.toLowerCase()
      : filterValue.every(
          (value) => fieldValue.toLowerCase() !== value.toLowerCase()
        );
  });
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
    () =>
      new Fuse(inputPlayers, {
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
      }),
    [inputPlayers]
  );

  // Handle filtering and sorting
  useEffect(() => {
    let players = [...inputPlayers];
    if (filterQueryObject.text) {
      players = freeTextFuse
        .search(diacritics.remove(filterQueryObject.text))
        .map((r) => r.item);
    }

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
        players = players.filter(
          (p) =>
            getFieldValue(p) >= +filterQueryObject[range.field].from &&
            (filterQueryObject.cost.to
              ? getFieldValue(p) <= filterQueryObject[range.field].to
              : true)
        );
      }
    }

    const sortFn =
      sortOptions.find((o) => o.value === sort)?.sortFn ||
      sortOptions[0].sortFn;
    players = players.sort(sortFn);

    onResults(players);
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
