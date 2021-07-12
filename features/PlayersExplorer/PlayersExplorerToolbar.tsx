import {
  Box,
  Button,
  Divider,
  HStack,
  Icon,
  IconButton,
  Input,
  InputGroup,
  InputLeftElement,
  Select,
  Tooltip,
  useDisclosure,
} from "@chakra-ui/react";
import { ChangeEvent, MouseEventHandler, useEffect } from "react";
import { IoPeopleOutline, IoSearchOutline } from "react-icons/io5";
import { Team } from "~/features/AppData/fplTypes";
import CustomPlayersModal from "~/features/CustomPlayer/CustomPlayersModal";
import { Player } from "~/features/PlayerData/playerDataTypes";
import {
  DisplayOptions,
  SortOptions,
} from "~/features/PlayersExplorer/playersExplorerTypes";
import {
  displayOptions,
  sortOptions,
} from "~/features/PlayersExplorer/playersToolbarOptions";
import usePlayersFilterAndSort from "~/features/PlayersExplorer/usePlayersFilterAndSort";

const PlayersExplorerToolbar = ({
  initialSeachQuery = "",
  players = [],
  fplTeams = [],
  onResults = () => {},
  display = displayOptions[0].value,
  onDisplayChange,
  disabledSorting = false,
  sortingTooltipLabel,
  showCompareButton = false,
  onCompareClick,
  onResetClick,
}: {
  initialSeachQuery?: string;
  players?: Player[];
  fplTeams?: Team[];
  onResults?: (players: Player[]) => void;
  display?: string;
  onDisplayChange?: (value: DisplayOptions) => void;
  disabledSorting?: boolean;
  sortingTooltipLabel?: string;
  showCompareButton?: boolean;
  onCompareClick?: MouseEventHandler<HTMLButtonElement>;
  onResetClick?: MouseEventHandler<HTMLButtonElement>;
}) => {
  const { filterQuery, setFilterQuery, sort, setSort, fiterThenSortFn } =
    usePlayersFilterAndSort({
      initialSeachQuery,
      players,
    });

  const { isOpen, onOpen, onClose } = useDisclosure();

  const handleDisplayChange = (e: ChangeEvent<HTMLSelectElement>) => {
    onDisplayChange?.(e.target.value as DisplayOptions);
  };

  const handleSortChange = (e: ChangeEvent<HTMLSelectElement>) => {
    const value = e.target.value;
    setSort(value as SortOptions);
  };

  useEffect(() => {
    onResults(fiterThenSortFn(players));
  }, [fiterThenSortFn]);

  return (
    <>
      <CustomPlayersModal
        players={players}
        fplTeams={fplTeams}
        isOpen={isOpen}
        onClose={onClose}
      />
      <HStack
        alignItems="center"
        height="50px"
        px={1}
        spacing={1}
        borderBottomWidth={1}
      >
        {showCompareButton && (
          <>
            <HStack flexShrink={0}>
              <Button borderRadius="none" onClick={onCompareClick}>
                Compare
              </Button>
              <Button
                variant="outline"
                borderRadius="none"
                onClick={onResetClick}
              >
                Reset
              </Button>
            </HStack>
            <Divider orientation="vertical" />
          </>
        )}
        <Box flexGrow={1}>
          <InputGroup mr={1}>
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
          <Box flexShrink={0}>
            <Select
              disabled={disabledSorting}
              borderWidth={0}
              borderRadius="none"
              value={sort}
              onChange={handleSortChange}
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
        <Box flexShrink={0}>
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
        <Divider orientation="vertical" />
        <Box flexShrink={0}>
          <IconButton
            variant="ghost"
            borderRadius="none"
            aria-label="custom players"
            icon={<Icon as={IoPeopleOutline} />}
            onClick={onOpen}
          />
        </Box>
      </HStack>
    </>
  );
};

export default PlayersExplorerToolbar;
