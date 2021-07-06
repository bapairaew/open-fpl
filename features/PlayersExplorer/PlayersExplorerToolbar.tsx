import {
  Box,
  Divider,
  HStack,
  Input,
  InputGroup,
  InputLeftElement,
  Select,
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
  initialDisplay = displayOptions[0].value,
  players = [],
  onSearchResults = () => {},
  onDisplayChange = () => {},
}: {
  initialSeachQuery?: string;
  initialDisplay?: string;
  players?: Player[];
  onSearchResults?: (players: Player[]) => void;
  onDisplayChange?: (value: string) => void;
}) => {
  const [display, setDisplay] = useState(initialDisplay);
  const { filterQuery, setFilterQuery, sort, setSort } = usePlayersToolbar({
    initialSeachQuery,
    players,
    onResults: onSearchResults,
  });
  const handleDisplayChange = (e: ChangeEvent<HTMLSelectElement>) => {
    setDisplay(e.target.value);
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
      <Box p={1} flexShrink={0}>
        <Select
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
