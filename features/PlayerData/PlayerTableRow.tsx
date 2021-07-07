import {
  Box,
  Flex,
  Grid,
  Icon,
  IconButton,
  Link as A,
  TableRowProps,
  Td,
  Text,
  Tooltip,
  Tr,
} from "@chakra-ui/react";
import { IoOpenOutline, IoWarningOutline } from "react-icons/io5";
import { Gameweek, Player } from "~/features/AppData/appDataTypes";
import {
  positionColorCodes,
  statusColorCodes,
} from "~/features/AppData/fplColors";
import CenterFlex from "~/features/PlayerData/CenterFlex";
import FixturesSection from "~/features/PlayerData/FixturesSection";
import { rowHeight, rowWidth } from "~/features/PlayerData/PlayerTable";
import PointsSection from "~/features/PlayerData/PointsSection";
import {
  getPaddedPastMatches,
  XGAStats,
  XGIStats,
} from "~/features/PlayerData/PreviousStatsSection";
import playerTableConfigs from "~/features/PlayerData/playerTableConfigs";

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
    <Tr width={`${rowWidth}px`} {...props}>
      <Td p={0} left={0}>
        <Flex
          height={`${rowHeight}px`}
          width={`${playerTableConfigs.Tool.columnWidth}px`}
          alignItems="center"
          px={2}
        >
          <A
            isExternal
            href={
              player.linked_data?.understat_id
                ? `https://understat.com/player/${player.linked_data.understat_id}`
                : `https://understat.com/league/EPL`
            }
          >
            <IconButton
              size="xs"
              variant="ghost"
              aria-label="open in Understat"
              icon={<Icon as={IoOpenOutline} />}
            />
          </A>
        </Flex>
      </Td>
      <Td p={0} left={0} bg="white" fontWeight="bold" position="sticky">
        <Flex
          height={`${rowHeight}px`}
          width={`${playerTableConfigs.Name.columnWidth}px`}
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
          width={`${playerTableConfigs.Team.columnWidth}px`}
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
          width={`${playerTableConfigs.Position.columnWidth}px`}
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
          width={`${playerTableConfigs.Cost.columnWidth}px`}
          fontSize="sm"
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
          width={`${playerTableConfigs.Ownership.columnWidth}px`}
          fontSize="sm"
        >
          {(+player.selected_by_percent).toFixed(1)}%
        </Flex>
      </Td>
      <Td p={0}>
        <Box width={`${playerTableConfigs.Fixtures.columnWidth}px`}>
          <FixturesSection
            variant="mini"
            player={player}
            gameweeks={gameweeks}
          />
        </Box>
      </Td>
      <Td p={0}>
        <Flex
          width={`${playerTableConfigs.Points.columnWidth}px`}
          height={`${rowHeight}px`}
        >
          <PointsSection variant="mini" player={player} />
        </Flex>
      </Td>
      <Td p={0}>
        <Grid
          gap={0}
          templateColumns="repeat(6, 1fr)"
          width={`${playerTableConfigs.xGI.columnWidth}px`}
          height={`${rowHeight}px`}
        >
          <XGIStats player={player} pastMatches={pastMatches} variant="mini" />
        </Grid>
      </Td>
      <Td p={0}>
        <Grid
          gap={0}
          templateColumns="repeat(6, 1fr)"
          width={`${playerTableConfigs.xGA.columnWidth}px`}
          height={`${rowHeight}px`}
        >
          <XGAStats player={player} pastMatches={pastMatches} variant="mini" />
        </Grid>
      </Td>
    </Tr>
  );
};

export default PlayerTableRow;
