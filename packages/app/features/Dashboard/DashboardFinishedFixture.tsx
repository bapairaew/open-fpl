import { Box, Flex } from "@chakra-ui/react";
import { AppEntryEventPick } from "@open-fpl/app/features/Api/apiTypes";
import DashboardFixturePlayerStat from "@open-fpl/app/features/Dashboard/DashboardFixturePlayerStat";
import { geStatsFromFixture } from "@open-fpl/app/features/Dashboard/dashboardFixtures";
import { Player } from "@open-fpl/data/features/AppData/playerDataTypes";
import { Fixture, Team } from "@open-fpl/data/features/RemoteData/fplTypes";
import { useMemo } from "react";

const DashboardFinishedFixture = ({
  fixture,
  fplTeams,
  players,
  currentPicks,
}: {
  fixture: Fixture;
  fplTeams: Team[];
  players: Player[];
  currentPicks?: AppEntryEventPick[];
}) => {
  const home = fplTeams.find((t) => t.id === fixture.team_h);
  const away = fplTeams.find((t) => t.id === fixture.team_a);

  const { homePlayersStat, awayPlayersStat } = useMemo(() => {
    return geStatsFromFixture(fixture.stats, players, currentPicks);
  }, [fixture.stats, players, currentPicks]);

  return (
    <Flex
      borderWidth={1}
      px={4}
      py={2}
      borderRadius="md"
      flexDirection="column"
    >
      <Flex
        my={2}
        flexGrow={1}
        width="100%"
        justifyContent="space-around"
        fontSize="2xl"
        fontWeight="black"
      >
        <Box>
          <Box>{home?.short_name}</Box>
          <Box
            height="5px"
            width="100%"
            layerStyle={`fpl-team-${home?.short_name}`}
          />
        </Box>
        <Flex fontSize="2xl">
          <Box>{fixture.team_h_score}</Box>
          <Box mx={2}>-</Box>
          <Box>{fixture.team_a_score}</Box>
        </Flex>
        <Box>
          <Box>{away?.short_name}</Box>
          <Box
            height="5px"
            width="100%"
            layerStyle={`fpl-team-${away?.short_name}`}
          />
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

export default DashboardFinishedFixture;
