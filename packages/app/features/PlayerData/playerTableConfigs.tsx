import {
  Box,
  Flex,
  Grid,
  TableCellProps,
  Td,
  Text,
  Th,
  Tooltip,
} from "@chakra-ui/react";
import CenterFlex from "@open-fpl/app/features/PlayerData/CenterFlex";
import FixturesSection from "@open-fpl/app/features/PlayerData/FixturesSection";
import PastMatchesStats from "@open-fpl/app/features/PlayerData/PastMatchesStats";
import { assumedMax } from "@open-fpl/app/features/PlayerData/playerData";
import playersSortFunctions from "@open-fpl/app/features/PlayerData/playersSortFunctions";
import { PlayerTableConfig } from "@open-fpl/app/features/PlayerData/playerTableTypes";
import PointsSection from "@open-fpl/app/features/PlayerData/PointsSection";
import { IoWarningOutline } from "react-icons/io5";

const TableCell = (props: TableCellProps) => <Td p={0} {...props} />;

const playerTableConfigs = [
  {
    header: "Name",
    columnWidth: 130,
    sticky: 0,
    sortFn: playersSortFunctions.name,
    reversedSortFn: playersSortFunctions.reversedName,
    render: ({ player, config, cellProps }) => {
      const { zIndex, ...props } = cellProps ?? {};
      return (
        <Th
          p={0}
          fontWeight="bold"
          position="sticky"
          left={config.sticky}
          textTransform="none"
          zIndex={typeof zIndex === "number" ? (zIndex ?? 1) + 1 : zIndex}
          {...props}
        >
          <Flex width={`${config.columnWidth}px`} alignItems="center">
            {player.status !== "a" && (
              <Tooltip hasArrow label={player.news}>
                <CenterFlex
                  layerStyle={`fpl-status-${player.status}`}
                  height="100%"
                >
                  <IoWarningOutline />
                </CenterFlex>
              </Tooltip>
            )}
            <Text px={2} textAlign="left" fontSize="sm" noOfLines={1}>
              {player.web_name}
            </Text>
          </Flex>
        </Th>
      );
    },
  },
  {
    header: "Team",
    columnWidth: 80,
    sortFn: playersSortFunctions.team,
    reversedSortFn: playersSortFunctions.reversedTeam,
    render: ({ player, config, cellProps }) => {
      return (
        <TableCell {...cellProps}>
          <CenterFlex
            height="32px"
            width={`${config.columnWidth}px`}
            layerStyle={`fpl-team-${player.team.short_name}`}
          >
            {player.team.short_name}
          </CenterFlex>
        </TableCell>
      );
    },
  },
  {
    header: "Pos",
    columnWidth: 80,
    sortFn: playersSortFunctions.position,
    reversedSortFn: playersSortFunctions.reversedPosition,
    render: ({ player, config, cellProps }) => {
      return (
        <TableCell {...cellProps}>
          <CenterFlex
            height="32px"
            width={`${config.columnWidth}px`}
            layerStyle={`fpl-position-${player.element_type.singular_name_short}`}
          >
            {player.element_type.singular_name_short}
          </CenterFlex>
        </TableCell>
      );
    },
  },
  {
    header: "Cost",
    columnWidth: 80,
    sortFn: playersSortFunctions.cost,
    reversedSortFn: playersSortFunctions.reversedCost,
    render: ({ player, config, cellProps }) => (
      <TableCell {...cellProps}>
        <Flex
          pr={4}
          justifyContent="flex-end"
          alignItems="center"
          width={`${config.columnWidth}px`}
          fontSize="sm"
        >
          £{(player.now_cost / 10).toFixed(1)}
        </Flex>
      </TableCell>
    ),
  },
  {
    header: "Own",
    columnWidth: 80,
    sortFn: playersSortFunctions.ownership,
    reversedSortFn: playersSortFunctions.reversedOwnership,
    render: ({ player, config, cellProps }) => (
      <TableCell {...cellProps}>
        <Flex
          pr={4}
          justifyContent="flex-end"
          alignItems="center"
          width={`${config.columnWidth}px`}
          fontSize="sm"
        >
          {(+player.selected_by_percent).toFixed(1)}%
        </Flex>
      </TableCell>
    ),
  },
  {
    header: "Fixtures",
    columnWidth: 300,
    sortFn: playersSortFunctions.fixtures,
    reversedSortFn: playersSortFunctions.reversedFixtures,
    render: ({ player, config, cellProps }) => (
      <TableCell {...cellProps}>
        <Box width={`${config.columnWidth}px`} height="32px">
          <FixturesSection player={player} />
        </Box>
      </TableCell>
    ),
  },
  {
    header: "Points",
    columnWidth: 300,
    sortFn: playersSortFunctions.points,
    reversedSortFn: playersSortFunctions.reversedPoints,
    render: ({ player, config, cellProps }) => (
      <TableCell {...cellProps}>
        <Flex width={`${config.columnWidth}px`} height="32px">
          <PointsSection player={player} />
        </Flex>
      </TableCell>
    ),
  },
  {
    header: "Goals",
    columnWidth: 300,
    sortFn: playersSortFunctions.goals,
    reversedSortFn: playersSortFunctions.reversedGoals,
    render: ({ player, pastMatches, config, cellProps }) => (
      <TableCell {...cellProps}>
        <Grid
          height="32px"
          gap={0}
          templateColumns="repeat(6, 1fr)"
          width={`${config.columnWidth}px`}
        >
          <PastMatchesStats
            pastMatches={pastMatches}
            valueKey="match_g"
            maxValue={assumedMax.g}
            sumValue={player.linked_data.season_g}
            decimal={0}
          />
        </Grid>
      </TableCell>
    ),
  },
  {
    header: "Assists",
    columnWidth: 300,
    sortFn: playersSortFunctions.assists,
    reversedSortFn: playersSortFunctions.reversedAssists,
    render: ({ player, pastMatches, config, cellProps }) => (
      <TableCell {...cellProps}>
        <Grid
          height="32px"
          gap={0}
          templateColumns="repeat(6, 1fr)"
          width={`${config.columnWidth}px`}
        >
          <PastMatchesStats
            pastMatches={pastMatches}
            valueKey="match_a"
            maxValue={assumedMax.a}
            sumValue={player.linked_data.season_a}
            decimal={0}
          />
        </Grid>
      </TableCell>
    ),
  },
  {
    header: "Shots",
    columnWidth: 300,
    sortFn: playersSortFunctions.shots,
    reversedSortFn: playersSortFunctions.reversedShots,
    render: ({ player, pastMatches, config, cellProps }) => (
      <TableCell {...cellProps}>
        <Grid
          height="32px"
          gap={0}
          templateColumns="repeat(6, 1fr)"
          width={`${config.columnWidth}px`}
        >
          <PastMatchesStats
            pastMatches={pastMatches}
            valueKey="match_shots"
            maxValue={assumedMax.shots}
            sumValue={player.linked_data.season_shots}
            decimal={0}
          />
        </Grid>
      </TableCell>
    ),
  },
  {
    header: "Key passes",
    columnWidth: 300,
    sortFn: playersSortFunctions.keyPasses,
    reversedSortFn: playersSortFunctions.reversedKeyPasses,
    render: ({ player, pastMatches, config, cellProps }) => (
      <TableCell {...cellProps}>
        <Grid
          height="32px"
          gap={0}
          templateColumns="repeat(6, 1fr)"
          width={`${config.columnWidth}px`}
        >
          <PastMatchesStats
            pastMatches={pastMatches}
            valueKey="match_key_passes"
            maxValue={assumedMax.keyPasses}
            sumValue={player.linked_data.season_key_passes}
            decimal={0}
          />
        </Grid>
      </TableCell>
    ),
  },
  {
    header: "xG",
    columnWidth: 300,
    sortFn: playersSortFunctions.xg,
    reversedSortFn: playersSortFunctions.reversedXG,
    render: ({ player, pastMatches, config, cellProps }) => (
      <TableCell {...cellProps}>
        <Grid
          height="32px"
          gap={0}
          templateColumns="repeat(6, 1fr)"
          width={`${config.columnWidth}px`}
        >
          <PastMatchesStats
            pastMatches={pastMatches}
            valueKey="match_xg"
            maxValue={assumedMax.xg}
            sumValue={player.linked_data.season_xg}
            decimal={1}
          />
        </Grid>
      </TableCell>
    ),
  },
  {
    header: "xA",
    columnWidth: 300,
    sortFn: playersSortFunctions.xa,
    reversedSortFn: playersSortFunctions.reversedXA,
    render: ({ player, pastMatches, config, cellProps }) => (
      <TableCell {...cellProps}>
        <Grid
          height="32px"
          gap={0}
          templateColumns="repeat(6, 1fr)"
          width={`${config.columnWidth}px`}
        >
          <PastMatchesStats
            pastMatches={pastMatches}
            valueKey="match_xa"
            maxValue={assumedMax.xa}
            sumValue={player.linked_data.season_xa}
            decimal={1}
          />
        </Grid>
      </TableCell>
    ),
  },
  {
    header: "xGA",
    columnWidth: 300,
    sortFn: playersSortFunctions.xga,
    reversedSortFn: playersSortFunctions.reversedXGA,
    render: ({ player, pastMatches, config, cellProps }) => (
      <TableCell {...cellProps}>
        <Grid
          height="32px"
          gap={0}
          templateColumns="repeat(6, 1fr)"
          width={`${config.columnWidth}px`}
        >
          <PastMatchesStats
            pastMatches={pastMatches}
            valueKey="match_xga"
            maxValue={assumedMax.xga}
            sumValue={player.linked_data.season_xga}
            decimal={1}
            isReversedScale
          />
        </Grid>
      </TableCell>
    ),
  },
] as PlayerTableConfig[];

export default playerTableConfigs;
