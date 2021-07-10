import {
  Box,
  Button,
  Divider,
  HStack,
  Input,
  InputGroup,
  InputLeftElement,
  Select,
  Tooltip,
} from "@chakra-ui/react";
import {
  ChangeEvent,
  MouseEventHandler,
  useEffect,
  useMemo,
  useState,
} from "react";
import { IoSearchOutline } from "react-icons/io5";
import { Player } from "~/features/AppData/appDataTypes";
import {
  DisplayOptions,
  SortOptions,
  SortOptionsConfig,
} from "~/features/PlayersExplorer/playersExplorerTypes";
import {
  displayOptions,
  sortOptions,
} from "~/features/PlayersExplorer/playersToolbarOptions";
import usePlayersFilterAndSort from "~/features/PlayersExplorer/usePlayersFilterAndSort";

type ExtendedSortOptions = SortOptions & "starred";

const PlayersExplorerToolbar = ({
  initialSeachQuery = "",
  players = [],
  starredPlayers = [],
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
  starredPlayers?: number[] | null;
  onResults?: (players: Player[]) => void;
  display?: string;
  onDisplayChange?: (value: DisplayOptions) => void;
  disabledSorting?: boolean;
  sortingTooltipLabel?: string;
  showCompareButton?: boolean;
  onCompareClick?: MouseEventHandler<HTMLButtonElement>;
  onResetClick?: MouseEventHandler<HTMLButtonElement>;
}) => {
  const { filterQuery, setFilterQuery, setSort, filterFn, fiterThenSortFn } =
    usePlayersFilterAndSort({
      initialSeachQuery,
      players,
    });

  const extendedSortOptions = useMemo(
    () =>
      [
        {
          label: "Starred players first",
          value: "starred",
          // Duplicate logic at features/PlayersExplorer/PlayersExplorerTable.tsx
          // TODO: should promote this to SortOptions and allow TransferMakert to have star players feature?
          sortFn: (a: Player, b: Player) => {
            const aIndex = starredPlayers?.findIndex((id) => id === a.id) ?? -1;
            const bIndex = starredPlayers?.findIndex((id) => id === b.id) ?? -1;
            if (aIndex > bIndex) return -1;
            else if (aIndex < bIndex) return 1;
            return 0;
          },
        } as SortOptionsConfig<ExtendedSortOptions>,
        ...sortOptions,
      ] as SortOptionsConfig<ExtendedSortOptions>[],
    [sortOptions, starredPlayers]
  );

  const [extendedSort, setExtendedSort] = useState(
    extendedSortOptions[0].value
  );

  const handleDisplayChange = (e: ChangeEvent<HTMLSelectElement>) => {
    onDisplayChange?.(e.target.value as DisplayOptions);
  };

  const handleSortChange = (e: ChangeEvent<HTMLSelectElement>) => {
    const value = e.target.value;
    setExtendedSort(value as ExtendedSortOptions);
    setSort(value as SortOptions);
  };

  useEffect(() => {
    if (extendedSort === "starred") {
      onResults(filterFn(players).sort(extendedSortOptions[0].sortFn));
    } else {
      onResults(fiterThenSortFn(players));
    }
  }, [extendedSort, starredPlayers, filterFn, fiterThenSortFn]);

  return (
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
            value={extendedSort}
            onChange={handleSortChange}
          >
            {extendedSortOptions.map((o) => (
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
    </HStack>
  );
};

export default PlayersExplorerToolbar;
