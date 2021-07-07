import {
  Box,
  Flex,
  Grid,
  Table,
  TableRowProps,
  Tbody,
  Td,
  Text,
  Th,
  Thead,
  Tooltip,
  Tr,
} from "@chakra-ui/react";
import { forwardRef } from "react";
import { IoWarningOutline } from "react-icons/io5";
import { Gameweek, Player } from "~/features/AppData/appDataTypes";
import {
  positionColorCodes,
  statusColorCodes,
} from "~/features/AppData/fplColors";
import CenterFlex from "~/features/PlayerData/CenterFlex";
import FixturesSection from "~/features/PlayerData/FixturesSection";
import PointsSection from "~/features/PlayerData/PointsSection";
import {
  getPaddedPastMatches,
  XGAStats,
  XGIStats,
} from "~/features/PlayerData/PreviousStatsSection";

export const columnsWidth = {
  Name: 200,
  Team: 100,
  Position: 100,
  Cost: 100,
  Ownership: 120,
  Fixtures: 300,
  Points: 300,
  xGI: 300,
  xGA: 300,
};

export const rowHeight = 30;

export const rowWidth = Object.values(columnsWidth).reduce((s, w) => s + w, 0);

export const PlayerTableHeaderRow = () => {
  return (
    <Thead
      height={`${rowHeight}px`}
      width={rowWidth}
      top={0}
      position="sticky"
      zIndex="sticky"
    >
      <Tr>
        {Object.entries(columnsWidth).map(([key, value]) => (
          <Th
            key={key}
            overflow="hidden"
            bg="white"
            width={`${value}px`}
            position={key === "Name" ? "sticky" : "static"}
            left={0}
          >
            {key}
          </Th>
        ))}
      </Tr>
    </Thead>
  );
};

export const PlayerTableRow = ({
  player,
  gameweeks,
  ...props
}: TableRowProps & {
  player: Player;
  gameweeks: Gameweek[];
}) => {
  const pastMatches = getPaddedPastMatches(player);
  return (
    <Tr width={rowWidth} {...props}>
      <Td p={0} left={0} bg="white" fontWeight="bold" position="sticky">
        <Flex
          height={`${rowHeight}px`}
          width={`${columnsWidth.Name}px`}
          alignItems="center"
        >
          {player.status !== "a" && (
            <Tooltip hasArrow label={player.news}>
              <CenterFlex
                variant="mini"
                bg={statusColorCodes[player.status]}
                height="100%"
              >
                <IoWarningOutline />
              </CenterFlex>
            </Tooltip>
          )}
          <Text px={2} textAlign="left" fontSize="sm">
            {player.web_name}
          </Text>
        </Flex>
      </Td>
      <Td p={0}>
        <CenterFlex
          variant="mini"
          width={`${columnsWidth.Team}px`}
          height={`${rowHeight}px`}
          bg={
            player.linked_data.teamcolorcodes
              ? player.linked_data.teamcolorcodes.text
                ? player.linked_data.teamcolorcodes.background!
                : player.linked_data.teamcolorcodes.highlight!
              : undefined
          }
          color={
            player.linked_data.teamcolorcodes
              ? player.linked_data.teamcolorcodes.text
                ? player.linked_data.teamcolorcodes.text!
                : player.linked_data.teamcolorcodes.background!
              : undefined
          }
        >
          {player.team.short_name}
        </CenterFlex>
      </Td>
      <Td p={0}>
        <CenterFlex
          variant="mini"
          width={`${columnsWidth.Position}px`}
          height={`${rowHeight}px`}
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
      <Td p={0}>
        <Flex
          pr={4}
          justifyContent="flex-end"
          alignItems="center"
          height={`${rowHeight}px`}
          width={`${columnsWidth.Cost}px`}
        >
          £{(player.now_cost / 10).toFixed(1)}
        </Flex>
      </Td>
      <Td p={0}>
        <Flex
          pr={4}
          justifyContent="flex-end"
          alignItems="center"
          height={`${rowHeight}px`}
          width={`${columnsWidth.Ownership}px`}
        >
          {(+player.selected_by_percent).toFixed(1)}%
        </Flex>
      </Td>
      <Td p={0}>
        <Box width={`${columnsWidth.Fixtures}px`}>
          <FixturesSection
            variant="mini"
            player={player}
            gameweeks={gameweeks}
          />
        </Box>
      </Td>
      <Td p={0}>
        <Flex width={`${columnsWidth.Points}px`} height={`${rowHeight}px`}>
          <PointsSection variant="mini" player={player} />
        </Flex>
      </Td>
      <Td p={0}>
        <Grid
          gap={0}
          templateColumns="repeat(6, 1fr)"
          width={`${columnsWidth.xGI}px`}
          height={`${rowHeight}px`}
        >
          <XGIStats player={player} pastMatches={pastMatches} variant="mini" />
        </Grid>
      </Td>
      <Td p={0}>
        <Grid
          gap={0}
          templateColumns="repeat(6, 1fr)"
          width={`${columnsWidth.xGA}px`}
          height={`${rowHeight}px`}
        >
          <XGAStats player={player} pastMatches={pastMatches} variant="mini" />
        </Grid>
      </Td>
    </Tr>
  );
};

const PlayerTable = forwardRef<HTMLDivElement>(
  ({ children, ...props }, ref) => (
    <div ref={ref} {...props}>
      <Table
        height="100%"
        width={rowWidth}
        size="sm"
        style={{
          tableLayout: "fixed",
        }}
      >
        <PlayerTableHeaderRow />
        <Tbody>{children}</Tbody>
      </Table>
    </div>
  )
);

export default PlayerTable;
