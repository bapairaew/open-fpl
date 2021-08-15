import { Badge, Box, Flex, Icon } from "@chakra-ui/react";
import {
  AppEntryEventPick,
  AppFixture,
  AppLive,
} from "@open-fpl/app/features/Api/apiTypes";
import DashboardFixturePlayerStat from "@open-fpl/app/features/Dashboard/DashboardFixturePlayerStat";
import { getStatsFromLive } from "@open-fpl/app/features/Dashboard/dashboardFixtures";
import { Player } from "@open-fpl/data/features/AppData/playerDataTypes";
import { Team } from "@open-fpl/data/features/AppData/teamDataTypes";
import { useMemo } from "react";
import { IoRadioButtonOnOutline } from "react-icons/io5";

const DashboardLiveFixture = ({
  live,
  fixture,
  teams,
  players,
  currentPicks,
}: {
  live: AppLive | null;
  fixture: AppFixture;
  teams: Team[];
  players: Player[];
  currentPicks?: AppEntryEventPick[];
}) => {
  const { home, away } = useMemo(() => {
    const home = teams.find((t) => t.id === fixture.team_h);
    const away = teams.find((t) => t.id === fixture.team_a);

    return {
      home,
      away,
    };
  }, [teams, fixture]);

  const { homePlayersStat, awayPlayersStat, minutes, homeScore, awayScore } =
    useMemo(() => {
      const { homePlayersStat, awayPlayersStat } = live
        ? getStatsFromLive(live, players, currentPicks, home, away)
        : { homePlayersStat: null, awayPlayersStat: null };

      const minutes = Math.max(
        ...[
          ...(homePlayersStat?.map((s) => s.stats.minutes) ?? [0]),
          ...(awayPlayersStat?.map((s) => s.stats.minutes) ?? [0]),
        ]
      );

      const homeScore =
        homePlayersStat?.reduce((sum, s) => sum + s.stats.goals_scored, 0) ?? 0;
      const awayScore =
        awayPlayersStat?.reduce((sum, s) => sum + s.stats.goals_scored, 0) ?? 0;

      return {
        homePlayersStat,
        awayPlayersStat,
        minutes,
        homeScore,
        awayScore,
      };
    }, [live, players, currentPicks, home, away]);

  if (fixture.id === 8) {
    console.log(awayPlayersStat);
  }

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
          <Box fontSize="4xl">{homeScore}</Box>
        </Box>
        <Box mx={2} fontSize="sm" layerStyle="subtitle">
          {minutes}"
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
          <Box fontSize="4xl">{awayScore}</Box>
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
