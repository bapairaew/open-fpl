import {
  Box,
  Divider,
  HStack,
  Input,
  InputGroup,
  InputLeftElement,
  Select,
  Tooltip,
} from "@chakra-ui/react";
import { ChangeEvent, useState } from "react";
import { IoSearchOutline } from "react-icons/io5";
import { Player } from "~/features/AppData/appDataTypes";
import {
  displayOptions,
  sortOptions,
} from "~/features/PlayersExplorer/playersToolbarOptions";
import usePlayersToolbar from "~/features/PlayersExplorer/usePlayersToolbar";

const PlayersExplorerToolbar = ({
  initialSeachQuery = "",
  players = [],
  onSearchResults = () => {},
  display = displayOptions[0].value,
  onDisplayChange = () => {},
  disabledSorting = false,
  sortingTooltipLabel,
}: {
  initialSeachQuery?: string;
  players?: Player[];
  onSearchResults?: (players: Player[]) => void;
  display?: string;
  onDisplayChange?: (value: string) => void;
  disabledSorting?: boolean;
  sortingTooltipLabel?: string;
}) => {
  const { filterQuery, setFilterQuery, sort, setSort } = usePlayersToolbar({
    initialSeachQuery,
    players,
    onResults: onSearchResults,
  });

  const handleDisplayChange = (e: ChangeEvent<HTMLSelectElement>) => {
    onDisplayChange(e.target.value);
  };

  return (
    <HStack alignItems="center" height="50px" borderBottomWidth={1}>
      <Box p={1} flexGrow={1}>
        <InputGroup m={1}>
          <InputLeftElement
            pointerEvents="none"
            children={<IoSearchOutline />}
          />
          <Input
            borderWidth={0}
            borderRadius="none"
            placeholder="Search for player..."
            value={filterQuery}
            onChange={(e) => setFilterQuery(e.target.value)}
          />
        </InputGroup>
      </Box>
      <Divider orientation="vertical" />
      <Tooltip label={sortingTooltipLabel} hasArrow>
        <Box p={1} flexShrink={0}>
          <Select
            disabled={disabledSorting}
            borderWidth={0}
            borderRadius="none"
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
      </Tooltip>
      <Divider orientation="vertical" />
      <Box p={1} flexShrink={0}>
        <Select
          borderWidth={0}
          borderRadius="none"
          value={display}
          onChange={handleDisplayChange}
        >
          {displayOptions.map((o) => (
            <option key={o.value} value={o.value}>
              {o.label}
            </option>
          ))}
        </Select>
      </Box>
    </HStack>
  );
};

export default PlayersExplorerToolbar;
