import { Box, Button, Flex, Grid, useDisclosure } from "@chakra-ui/react";
import DashboardCurrentFixtureModal from "@open-fpl/app/features/Dashboard/DashboardCurrentFixtureModal";
import DashboardFixturePlayerStat from "@open-fpl/app/features/Dashboard/DashboardFixturePlayerStat";
import { DashboardFixture } from "@open-fpl/app/features/Dashboard/dashboardTypes";

const DashboardFinishedFixture = ({
  fixture,
  onOpened,
}: {
  fixture: DashboardFixture;
  onOpened: (fixture: DashboardFixture) => void;
}) => {
  const { isOpen, onOpen, onClose } = useDisclosure();

  const homePlayers = fixture.team_h_players?.filter(
    (p) => p.stats?.minutes ?? 0 > 0
  );
  const awayPlayers = fixture.team_a_players?.filter(
    (p) => p.stats?.minutes ?? 0 > 0
  );

  const homeXG =
    fixture.team_h?.stats?.matches
      .find((m) => m.opponent === fixture.team_a?.id)
      ?.xg.toFixed(2) ?? null;
  const awayXG =
    fixture.team_a?.stats?.matches
      .find((m) => m.opponent === fixture.team_h?.id)
      ?.xg.toFixed(2) ?? null;

  const handleOpen = () => {
    onOpen();
    onOpened?.(fixture);
  };

  return (
    <>
      {isOpen && (
        <DashboardCurrentFixtureModal
          isOpen={isOpen}
          onClose={onClose}
          fixture={fixture}
          homeXG={homeXG}
          awayXG={awayXG}
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
          <Grid
            my={2}
            templateColumns="repeat(3, 1fr)"
            flexGrow={1}
            width="100%"
            fontSize="2xl"
            fontWeight="black"
          >
            <Box textAlign="center">
              <Box
                width="100%"
                layerStyle={`fpl-team-${fixture.team_h?.short_name}`}
              >
                {fixture.team_h?.short_name}
              </Box>
            </Box>
            <Box>
              <Box fontSize="2xl" textAlign="center">
                {fixture.team_h_score} - {fixture.team_a_score}
              </Box>
              <Box
                fontSize="sm"
                layerStyle="subtitle"
                fontWeight="normal"
                textAlign="center"
                height="21px"
              >
                {homeXG && awayXG ? `${homeXG} - ${awayXG}` : ""}
              </Box>
            </Box>
            <Box textAlign="center">
              <Box
                width="100%"
                layerStyle={`fpl-team-${fixture.team_a?.short_name}`}
              >
                {fixture.team_a?.short_name}
              </Box>
            </Box>
          </Grid>
          <Flex
            fontSize="xs"
            height="60px"
            layerStyle="subtitle"
            overflow="auto"
          >
            <Box width="50%">
              {homePlayers.map((e) => (
                <DashboardFixturePlayerStat
                  key={e.player.id}
                  playerStat={e}
                  align="left"
                />
              ))}
            </Box>
            <Box width="50%">
              {awayPlayers.map((e) => (
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
          onClick={handleOpen}
        />
      </Box>
    </>
  );
};

export default DashboardFinishedFixture;
