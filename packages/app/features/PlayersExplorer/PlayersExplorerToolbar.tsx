import {
  Box,
  BoxProps,
  Button,
  Divider,
  HStack,
  Icon,
  IconButton,
  Input,
  InputGroup,
  InputLeftElement,
  Menu,
  MenuButton,
  MenuItemOption,
  MenuList,
  MenuOptionGroup,
  Portal,
  Select,
  Tooltip,
} from "@chakra-ui/react";
import { AnalyticsPlayerStatisticsExplorer } from "@open-fpl/app/features/Analytics/analyticsTypes";
import { AppDrawerOpenButton } from "@open-fpl/app/features/Layout/AppDrawer";
import { ClientPlayer } from "@open-fpl/app/features/PlayerData/playerDataTypes";
import {
  DisplayOptions,
  SortOptions,
} from "@open-fpl/app/features/PlayersExplorer/playersExplorerTypes";
import {
  displayOptions,
  sortOptions,
} from "@open-fpl/app/features/PlayersExplorer/playersToolbarOptions";
import usePlayersFilterAndSort from "@open-fpl/app/features/PlayersExplorer/usePlayersFilterAndSort";
import { usePlausible } from "next-plausible";
import dynamic from "next/dynamic";
import { ChangeEvent, MouseEventHandler, useEffect } from "react";
import { IoSearchOutline, IoSettingsOutline } from "react-icons/io5";

const PlayersExplorerToolbar = ({
  initialSeachQuery = "",
  players = [],
  onResults = () => {},
  display = displayOptions[0].value,
  onDisplayChange,
  disabledSorting = false,
  sortingTooltipLabel,
  showCompareButton = false,
  onCompareClick,
  onResetClick,
  ...props
}: BoxProps & {
  initialSeachQuery?: string;
  players?: ClientPlayer[];
  onResults?: (players: ClientPlayer[]) => void;
  display?: string;
  onDisplayChange?: (value: DisplayOptions) => void;
  disabledSorting?: boolean;
  sortingTooltipLabel?: string;
  showCompareButton?: boolean;
  onCompareClick?: MouseEventHandler<HTMLButtonElement>;
  onResetClick?: MouseEventHandler<HTMLButtonElement>;
}) => {
  const plausible = usePlausible<AnalyticsPlayerStatisticsExplorer>();
  const { filterQuery, setFilterQuery, sort, setSort, fiterThenSortFn } =
    usePlayersFilterAndSort({
      initialSeachQuery,
      players,
    });

  const handleDisplayChange = (value: string) => {
    onDisplayChange?.(value as DisplayOptions);
    plausible("players-display", { props: { display: value } });
  };

  const handleSortChange = (value: string) => {
    setSort(value as SortOptions);
    plausible("players-sort", { props: { sort: value } });
  };

  const handleQueryChange = (e: ChangeEvent<HTMLInputElement>) => {
    setFilterQuery(e.target.value);
    plausible("players-query", { props: { query: e.target.value } });
  };

  useEffect(() => {
    onResults(fiterThenSortFn(players));
  }, [fiterThenSortFn]);

  return (
    <HStack
      alignItems="center"
      height="50px"
      width="100%"
      px={1}
      spacing={1}
      {...props}
    >
      <HStack spacing={1} height="50px" display={{ base: "flex", sm: "none" }}>
        <AppDrawerOpenButton />
        <Divider orientation="vertical" />
      </HStack>
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
      <HStack flexGrow={1} spacing={1} height="50px" display="flex">
        <InputGroup mr={1}>
          <InputLeftElement
            pointerEvents="none"
            children={<IoSearchOutline />}
          />
          <Input
            aria-label="search for players"
            borderWidth={0}
            borderRadius="none"
            placeholder="Search for players..."
            value={filterQuery}
            onChange={handleQueryChange}
          />
        </InputGroup>
        <Divider orientation="vertical" />
      </HStack>
      <HStack
        spacing={1}
        height="50px"
        display={{ base: "flex", sm: "none" }} // Only shown on mobile
      >
        <Menu isLazy>
          {({ isOpen }) => (
            <>
              <MenuButton
                aria-label="sort and display options"
                as={IconButton}
                borderRadius="none"
                variant="ghost"
                icon={<Icon as={IoSettingsOutline} />}
              />
              {isOpen && (
                <Portal>
                  <MenuList zIndex="popover">
                    {sortingTooltipLabel ? null : (
                      <MenuOptionGroup
                        title="Sort"
                        type="radio"
                        value={sort}
                        onChange={(value) =>
                          typeof value === "string"
                            ? handleSortChange(value)
                            : handleSortChange(value[0])
                        }
                      >
                        {sortOptions.map((o) => (
                          <MenuItemOption key={o.value} value={o.value}>
                            {o.label}
                          </MenuItemOption>
                        ))}
                      </MenuOptionGroup>
                    )}
                    <MenuOptionGroup
                      title="Display"
                      type="radio"
                      value={display}
                      onChange={(value) =>
                        typeof value === "string"
                          ? handleDisplayChange(value)
                          : handleDisplayChange(value[0])
                      }
                    >
                      {displayOptions.map((o) => (
                        <MenuItemOption key={o.value} value={o.value}>
                          {o.label}
                        </MenuItemOption>
                      ))}
                    </MenuOptionGroup>
                  </MenuList>
                </Portal>
              )}
            </>
          )}
        </Menu>
      </HStack>
      <HStack spacing={1} height="50px" display={{ base: "none", sm: "flex" }}>
        <Tooltip label={sortingTooltipLabel} hasArrow>
          <Box flexShrink={0}>
            <Select
              aria-label="sort players"
              disabled={disabledSorting}
              borderWidth={0}
              borderRadius="none"
              value={sort}
              onChange={(e) => handleSortChange(e.target.value)}
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
            aria-label="select display options"
            borderWidth={0}
            borderRadius="none"
            value={display}
            onChange={(e) => handleDisplayChange(e.target.value)}
          >
            {displayOptions.map((o) => (
              <option key={o.value} value={o.value}>
                {o.label}
              </option>
            ))}
          </Select>
        </Box>
      </HStack>
    </HStack>
  );
};

export default PlayersExplorerToolbar;
