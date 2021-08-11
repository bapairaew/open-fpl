import { Badge, Box, Flex, Icon } from "@chakra-ui/react";
import {
  AppEntryEventPick,
  AppLive,
} from "@open-fpl/app/features/Api/apiTypes";
import DashboardFixturePlayerStat from "@open-fpl/app/features/Dashboard/DashboardFixturePlayerStat";
import {
  geStatsFromFixture,
  getStatsFromLive,
} from "@open-fpl/app/features/Dashboard/dashboardFixtures";
import { Player } from "@open-fpl/data/features/AppData/playerDataTypes";
import { Fixture, Team } from "@open-fpl/data/features/RemoteData/fplTypes";
import { useMemo } from "react";
import { IoRadioButtonOnOutline } from "react-icons/io5";

const DashboardLiveFixture = ({
  live,
  fixture,
  fplTeams,
  players,
  currentPicks,
}: {
  live?: AppLive;
  fixture: Fixture;
  fplTeams: Team[];
  players: Player[];
  currentPicks?: AppEntryEventPick[];
}) => {
  const home = fplTeams.find((t) => t.id === fixture.team_h);
  const away = fplTeams.find((t) => t.id === fixture.team_a);

  const { homePlayersStat, awayPlayersStat } = useMemo(() => {
    return live
      ? getStatsFromLive(live, fixture.stats, players, currentPicks)
      : geStatsFromFixture(fixture.stats, players, currentPicks);
  }, [fixture.stats, players, currentPicks]);

  return (
    <Flex
      borderWidth={1}
      px={4}
      py={2}
      borderRadius="md"
      flexDirection="column"
    >
      <Flex mt={-2} ml={-2} mb={2} fontSize="sm" textAlign="left">
        <Badge colorScheme="red">
          <Icon as={IoRadioButtonOnOutline} mr={0.5} mb={0.5} />
          Live
        </Badge>
      </Flex>
      <Flex
        my={2}
        flexGrow={1}
        width="100%"
        alignItems="center"
        justifyContent="space-around"
      >
        <Box fontWeight="black" textAlign="center">
          <Box
            py={1}
            px={2}
            fontSize="sm"
            layerStyle={`fpl-team-${home?.short_name}`}
          >
            {home?.short_name}
          </Box>
          <Box fontSize="4xl">{fixture.team_h_score}</Box>
        </Box>
        <Box mx={2} fontSize="sm" layerStyle="subtitle">
          {fixture.minutes}"
        </Box>
        <Box fontWeight="black" textAlign="center">
          <Box
            py={1}
            px={2}
            fontSize="sm"
            layerStyle={`fpl-team-${away?.short_name}`}
          >
            {away?.short_name}
          </Box>
          <Box fontSize="4xl">{fixture.team_a_score}</Box>
        </Box>
      </Flex>
      <Flex fontSize="xs" height="120px" layerStyle="subtitle" overflow="auto">
        <Box width="50%">
          {homePlayersStat?.map((e) => (
            <DashboardFixturePlayerStat
              key={e.player.id}
              playerStat={e}
              align="left"
            />
          ))}
        </Box>
        <Box width="50%">
          {awayPlayersStat?.map((e) => (
            <DashboardFixturePlayerStat
              key={e.player.id}
              playerStat={e}
              align="right"
            />
          ))}
        </Box>
      </Flex>
    </Flex>
  );
};

export default DashboardLiveFixture;
