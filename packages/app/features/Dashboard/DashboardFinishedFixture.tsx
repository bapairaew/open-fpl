import {
  Box,
  BoxProps,
  Button,
  Flex,
  Grid,
  useDisclosure,
} from "@chakra-ui/react";
import DashboardCurrentFixtureModal from "@open-fpl/app/features/Dashboard/DashboardCurrentFixtureModal";
import DashboardFixturePlayerStat from "@open-fpl/app/features/Dashboard/DashboardFixturePlayerStat";
import { DashboardFixture } from "@open-fpl/app/features/Dashboard/dashboardTypes";

const DashboardFinishedFixture = ({
  fixture,
  onOpened,
  ...props
}: BoxProps & {
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

  const homeMatch = fixture.team_h?.stats?.matches.find(
    (m) => m.opponent === fixture.team_a?.id
  );
  const awayMatch = fixture.team_a?.stats?.matches.find(
    (m) => m.opponent === fixture.team_h?.id
  );
  const found = awayMatch && homeMatch && homeMatch.id === awayMatch.id;
  const homeXG = found ? homeMatch?.xg.toFixed(2) ?? null : null;
  const awayXG = found ? awayMatch?.xg.toFixed(2) ?? null : null;
  const understatId = found ? homeMatch?.id : null;

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
          understatId={understatId}
          homePlayers={homePlayers}
          awayPlayers={awayPlayers}
        />
      )}
      <Box position="relative" {...props}>
        <Flex
          as="section"
          aria-label="fixture"
          borderWidth={1}
          px={4}
          py={2}
          borderRadius="md"
          flexDirection="column"
        >
          <Grid
            as="section"
            aria-label="results"
            my={2}
            templateColumns="repeat(3, 1fr)"
            flexGrow={1}
            width="100%"
            fontSize="2xl"
            fontWeight="black"
          >
            <Box textAlign="center" aria-label="home team">
              <Box
                width="100%"
                layerStyle={`fpl-team-${fixture.team_h?.short_name}`}
              >
                {fixture.team_h?.short_name}
              </Box>
            </Box>
            <Box>
              <Box fontSize="2xl" textAlign="center" aria-label="score">
                {fixture.team_h_score} - {fixture.team_a_score}
              </Box>
              <Box
                fontSize="sm"
                layerStyle="subtitle"
                fontWeight="normal"
                textAlign="center"
                height="21px"
                aria-label="expected score"
              >
                {homeXG && awayXG ? `${homeXG} - ${awayXG}` : ""}
              </Box>
            </Box>
            <Box textAlign="center" aria-label="away team">
              <Box
                width="100%"
                layerStyle={`fpl-team-${fixture.team_a?.short_name}`}
              >
                {fixture.team_a?.short_name}
              </Box>
            </Box>
          </Grid>
          <Flex
            as="section"
            aria-label="player statistics"
            role="list"
            fontSize="xs"
            height="60px"
            layerStyle="subtitle"
            overflow="auto"
          >
            <Box width="50%" aria-label="home team">
              {homePlayers.map((e) => (
                <DashboardFixturePlayerStat
                  key={e.player.id}
                  role="listitem"
                  playerStat={e}
                  align="left"
                />
              ))}
            </Box>
            <Box width="50%" aria-label="away team">
              {awayPlayers.map((e) => (
                <DashboardFixturePlayerStat
                  key={e.player.id}
                  role="listitem"
                  playerStat={e}
                  align="right"
                />
              ))}
            </Box>
          </Flex>
        </Flex>
        <Button
          variant="unstyled"
          aria-label="open fixture details"
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
