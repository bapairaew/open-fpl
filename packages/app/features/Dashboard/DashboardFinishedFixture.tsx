import { Box, Button, Flex, Grid, useDisclosure } from "@chakra-ui/react";
import DashboardFinishedFixtureModal from "@open-fpl/app/features/Dashboard/DashboardFinishedFixtureModal";
import DashboardFixturePlayerStat from "@open-fpl/app/features/Dashboard/DashboardFixturePlayerStat";
import { DashboardFixture } from "@open-fpl/app/features/Dashboard/dashboardTypes";

const DashboardFinishedFixture = ({
  fixture,
}: {
  fixture: DashboardFixture;
}) => {
  const { isOpen, onOpen, onClose } = useDisclosure();

  const homePlayers = fixture.team_h_players.filter((t) => t.picked);
  const awayPlayers = fixture.team_a_players.filter((t) => t.picked);

  return (
    <>
      {isOpen && (
        <DashboardFinishedFixtureModal
          isOpen={isOpen}
          onClose={onClose}
          fixture={fixture}
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
              <Box>
                {fixture.team_h?.short_name}
                <Box
                  height="5px"
                  width="100%"
                  layerStyle={`fpl-team-${fixture.team_h?.short_name}`}
                />
              </Box>
            </Box>
            <Box fontSize="2xl" textAlign="center">
              {fixture.team_h_score} - {fixture.team_a_score}
            </Box>
            <Box textAlign="center">
              <Box>{fixture.team_a?.short_name}</Box>
              <Box
                height="5px"
                width="100%"
                layerStyle={`fpl-team-${fixture.team_a?.short_name}`}
              />
            </Box>
          </Grid>
          <Flex
            fontSize="xs"
            height="60px"
            layerStyle="subtitle"
            overflow="auto"
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

export default DashboardFinishedFixture;
