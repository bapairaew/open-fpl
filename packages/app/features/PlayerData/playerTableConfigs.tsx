import { Box, Flex, Grid, Td, Text, Tooltip, Th } from "@chakra-ui/react";
import CenterFlex from "@open-fpl/app/features/PlayerData/CenterFlex";
import playersSortFunctions from "@open-fpl/app/features/PlayerData/playersSortFunctions";
import { PlayerTableConfig } from "@open-fpl/app/features/PlayerData/playerTableTypes";
import {
  statusColorCodes,
  positionColorCodes,
} from "@open-fpl/data/features/RemoteData/fplColors";
import { IoWarningOutline } from "react-icons/io5";
import { teamColorCodes } from "@open-fpl/app/features/TeamData/teamData";
import FixturesSection from "./FixturesSection";
import PointsSection from "./PointsSection";
import PastMatchesStats from "./PastMatchesStats";
import { assumedMax } from "./playerData";

const playerTableConfigs = [
  {
    header: "Name",
    columnWidth: 130,
    sticky: true,
    sortFn: playersSortFunctions.name,
    reversedSortFn: playersSortFunctions.reversedName,
    render: ({ player, config }) => (
      <Th
        p={0}
        bg="white"
        fontWeight="bold"
        position="sticky"
        left={0}
        textTransform="none"
      >
        <Flex width={`${config.columnWidth}px`} alignItems="center">
          {player.status !== "a" && (
            <Tooltip hasArrow label={player.news}>
              <CenterFlex
                bg={statusColorCodes[player.status].bg}
                color={statusColorCodes[player.status].color}
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
    ),
  },
  {
    header: "Team",
    columnWidth: 80,
    sortFn: playersSortFunctions.team,
    reversedSortFn: playersSortFunctions.reversedTeam,
    render: ({ player, config }) => (
      <Td p={0}>
        <CenterFlex
          width={`${config.columnWidth}px`}
          bg={
            teamColorCodes[player.team.short_name]
              ? teamColorCodes[player.team.short_name].bg
              : "white"
          }
          color={
            teamColorCodes[player.team.short_name]
              ? teamColorCodes[player.team.short_name].color
              : "black"
          }
        >
          {player.team.short_name}
        </CenterFlex>
      </Td>
    ),
  },
  {
    header: "Pos",
    columnWidth: 80,
    sortFn: playersSortFunctions.position,
    reversedSortFn: playersSortFunctions.reversedPosition,
    render: ({ player, config }) => (
      <Td p={0}>
        <CenterFlex
          width={`${config.columnWidth}px`}
          bg={
            positionColorCodes[player.element_type.singular_name_short]
              .background
          }
          color={
            positionColorCodes[player.element_type.singular_name_short].text
          }
        >
          {player.element_type.singular_name_short}
        </CenterFlex>
      </Td>
    ),
  },
  {
    header: "Cost",
    columnWidth: 80,
    sortFn: playersSortFunctions.cost,
    reversedSortFn: playersSortFunctions.reversedCost,
    render: ({ player, config }) => (
      <Td p={0}>
        <Flex
          pr={4}
          justifyContent="flex-end"
          alignItems="center"
          width={`${config.columnWidth}px`}
          fontSize="sm"
        >
          £{(player.now_cost / 10).toFixed(1)}
        </Flex>
      </Td>
    ),
  },
  {
    header: "Own",
    columnWidth: 80,
    sortFn: playersSortFunctions.ownership,
    reversedSortFn: playersSortFunctions.reversedOwnership,
    render: ({ player, config }) => (
      <Td p={0}>
        <Flex
          pr={4}
          justifyContent="flex-end"
          alignItems="center"
          width={`${config.columnWidth}px`}
          fontSize="sm"
        >
          {(+player.selected_by_percent).toFixed(1)}%
        </Flex>
      </Td>
    ),
  },
  {
    header: "Fixtures",
    columnWidth: 300,
    sortFn: playersSortFunctions.fixtures,
    reversedSortFn: playersSortFunctions.reversedFixtures,
    render: ({ player, config }) => (
      <Td p={0}>
        <Box width={`${config.columnWidth}px`}>
          <FixturesSection player={player} />
        </Box>
      </Td>
    ),
  },
  {
    header: "Points",
    columnWidth: 300,
    sortFn: playersSortFunctions.points,
    reversedSortFn: playersSortFunctions.reversedPoints,
    render: ({ player, config }) => (
      <Td p={0}>
        <Flex width={`${config.columnWidth}px`}>
          <PointsSection player={player} />
        </Flex>
      </Td>
    ),
  },
  {
    header: "Goals",
    columnWidth: 300,
    sortFn: playersSortFunctions.goals,
    reversedSortFn: playersSortFunctions.reversedGoals,
    render: ({ player, pastMatches, config }) => (
      <Td p={0}>
        <Grid
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
      </Td>
    ),
  },
  {
    header: "Assists",
    columnWidth: 300,
    sortFn: playersSortFunctions.assists,
    reversedSortFn: playersSortFunctions.reversedAssists,
    render: ({ player, pastMatches, config }) => (
      <Td p={0}>
        <Grid
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
      </Td>
    ),
  },
  {
    header: "Shots",
    columnWidth: 300,
    sortFn: playersSortFunctions.shots,
    reversedSortFn: playersSortFunctions.reversedShots,
    render: ({ player, pastMatches, config }) => (
      <Td p={0}>
        <Grid
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
      </Td>
    ),
  },
  {
    header: "Key passes",
    columnWidth: 300,
    sortFn: playersSortFunctions.keyPasses,
    reversedSortFn: playersSortFunctions.reversedKeyPasses,
    render: ({ player, pastMatches, config }) => (
      <Td p={0}>
        <Grid
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
      </Td>
    ),
  },
  {
    header: "xG",
    columnWidth: 300,
    sortFn: playersSortFunctions.xg,
    reversedSortFn: playersSortFunctions.reversedXG,
    render: ({ player, pastMatches, config }) => (
      <Td p={0}>
        <Grid
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
      </Td>
    ),
  },
  {
    header: "xA",
    columnWidth: 300,
    sortFn: playersSortFunctions.xa,
    reversedSortFn: playersSortFunctions.reversedXA,
    render: ({ player, pastMatches, config }) => (
      <Td p={0}>
        <Grid
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
      </Td>
    ),
  },
  {
    header: "xGA",
    columnWidth: 300,
    sortFn: playersSortFunctions.xga,
    reversedSortFn: playersSortFunctions.reversedXGA,
    render: ({ player, pastMatches, config }) => (
      <Td p={0}>
        <Grid
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
      </Td>
    ),
  },
] as PlayerTableConfig[];

export default playerTableConfigs;
