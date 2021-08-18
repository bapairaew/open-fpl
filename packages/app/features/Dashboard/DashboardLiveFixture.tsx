import { Box, Button, Flex, useDisclosure } from "@chakra-ui/react";
import DashboardFixturePlayerStat from "@open-fpl/app/features/Dashboard/DashboardFixturePlayerStat";
import DashboardLiveFixtureModal from "@open-fpl/app/features/Dashboard/DashboardLiveFixtureModal";
import { DashboardFixture } from "@open-fpl/app/features/Dashboard/dashboardTypes";

const DashboardLiveFixture = ({ fixture }: { fixture: DashboardFixture }) => {
  const { isOpen, onOpen, onClose } = useDisclosure();

  const minutes = Math.max(
    ...fixture.team_h_players.map((player) => player.stats?.minutes ?? 0)
  );

  const homePlayers = fixture.team_h_players?.filter(
    (p) => p.stats?.minutes ?? 0 > 0
  );

  const awayPlayers = fixture.team_a_players?.filter(
    (p) => p.stats?.minutes ?? 0 > 0
  );

  return (
    <>
      {isOpen && (
        <DashboardLiveFixtureModal
          isOpen={isOpen}
          onClose={onClose}
          fixture={fixture}
          minutes={minutes}
          homePlayers={homePlayers}
          awayPlayers={awayPlayers}
        />
      )}
      <Box position="relative">
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
            alignItems="center"
            justifyContent="space-around"
          >
            <Box fontWeight="black" textAlign="center">
              <Box
                py={1}
                px={2}
                fontSize="sm"
                layerStyle={`fpl-team-${fixture.team_h?.short_name}`}
              >
                {fixture.team_h?.short_name}
              </Box>
              <Box fontSize="4xl">{fixture.team_h_score ?? 0}</Box>
            </Box>
            <Box mx={2} fontSize="sm" layerStyle="subtitle">
              {minutes}"
            </Box>
            <Box fontWeight="black" textAlign="center">
              <Box
                py={1}
                px={2}
                fontSize="sm"
                layerStyle={`fpl-team-${fixture.team_a?.short_name}`}
              >
                {fixture.team_a?.short_name}
              </Box>
              <Box fontSize="4xl">{fixture.team_a_score ?? 0}</Box>
            </Box>
          </Flex>
          <Flex
            fontSize="xs"
            height="120px"
            layerStyle="subtitle"
            overflow="hidden"
          >
            <Box width="50%">
              {homePlayers?.map((e) => (
                <DashboardFixturePlayerStat
                  key={e.player.id}
                  playerStat={e}
                  align="left"
                />
              ))}
            </Box>
            <Box width="50%">
              {awayPlayers?.map((e) => (
                <DashboardFixturePlayerStat
                  key={e.player.id}
                  playerStat={e}
                  align="right"
                />
              ))}
            </Box>
          </Flex>
        </Flex>
        <Button
          variant="unstyled"
          aria-label="open match details"
          position="absolute"
          width="100%"
          height="100%"
          top={0}
          left={0}
          right={0}
          bottom={0}
          opactiy={0}
          onClick={onOpen}
        />
      </Box>
    </>
  );
};

export default DashboardLiveFixture;
