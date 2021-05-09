import { Box, Card, Flex, Input } from "@theme-ui/components";
import Fuse from "fuse.js";
import { useEffect, useMemo, useState } from "react";
import { IoSearchSharp } from "react-icons/io5";
import searchQueryParser from "search-query-parser";
import { useDebounce } from "use-debounce";

export const SEARCH_BAR_HEIGHT = 80;
export const searchOptions = {
  keywords: ["name", "team", "position"],
  ranges: ["cost"],
};

const PlayerSearchBar = ({
  initialSeachQuery = "",
  onResult = () => {},
  players: allPlayers = [],
}) => {
  const [searchQuery, setSearchQuery] = useState(initialSeachQuery);
  const [debouncedSearchQuery] = useDebounce(searchQuery, 300);

  const searchQueryObject = useMemo(() => {
    const searchQueryObject = searchQueryParser.parse(
      debouncedSearchQuery,
      searchOptions
    );
    return typeof searchQueryObject === "string"
      ? { text: searchQueryObject }
      : searchQueryObject;
  }, [debouncedSearchQuery]);

  const playersFuse = useMemo(
    () =>
      new Fuse(allPlayers, {
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
    [allPlayers]
  );

  useEffect(() => {
    let players = [...allPlayers];
    if (searchQueryObject.text) {
      players = playersFuse.search(searchQueryObject.text).map((r) => r.item);
    }
    if (searchQueryObject.name) {
      players = players.filter((p) =>
        typeof searchQueryObject.name === "string"
          ? p.web_name.match(new RegExp(searchQueryObject.name, "i"))
          : searchQueryObject.name.some((name) =>
              p.web_name.match(new RegExp(name, "i"))
            )
      );
    }
    if (searchQueryObject.team) {
      players = players.filter((p) =>
        typeof searchQueryObject.team === "string"
          ? p.team.short_name.match(new RegExp(searchQueryObject.team, "i"))
          : searchQueryObject.team.some((team) =>
              p.team.short_name.match(new RegExp(team, "i"))
            )
      );
    }
    if (searchQueryObject.position) {
      players = players.filter((p) =>
        typeof searchQueryObject.position === "string"
          ? p.element_type.singular_name_short.match(
              new RegExp(searchQueryObject.position, "i")
            )
          : searchQueryObject.position.some((position) =>
              p.element_type.singular_name_short.match(
                new RegExp(position, "i")
              )
            )
      );
    }
    if (searchQueryObject.cost) {
      players = players.filter(
        (p) =>
          p.now_cost / 10 >= +searchQueryObject.cost.from &&
          (searchQueryObject.cost.to
            ? p.now_cost / 10 <= searchQueryObject.cost.to
            : true)
      );
    }
    onResult(players);
  }, [allPlayers, searchQueryObject]);

  return (
    <Flex px={1} sx={{ alignItems: "center", height: SEARCH_BAR_HEIGHT }}>
      <Card
        variant="bare"
        sx={{ alignItems: "center", width: "100%", position: "relative" }}
      >
        <Box ml={1} p={2} sx={{ position: "absolute" }}>
          <IoSearchSharp size="1rem" />
        </Box>
        <Input
          pl={40}
          sx={{ border: 0 }}
          placeholder="Search"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
      </Card>
    </Flex>
  );
};

export default PlayerSearchBar;
