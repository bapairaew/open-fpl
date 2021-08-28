import {
  Badge,
  Box,
  BoxProps,
  Button,
  Flex,
  useDisclosure,
  VStack,
} from "@chakra-ui/react";
import DashboardCurrentFixtureModal from "@open-fpl/app/features/Dashboard/DashboardCurrentFixtureModal";
import DashboardFixturePlayerStat from "@open-fpl/app/features/Dashboard/DashboardFixturePlayerStat";
import { DashboardFixture } from "@open-fpl/app/features/Dashboard/dashboardTypes";

const DashboardLiveFixture = ({
  fixture,
  onOpened,
  ...props
}: BoxProps & {
  fixture: DashboardFixture;
  onOpened?: (fixture: DashboardFixture) => void;
}) => {
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
  const isPicked = [...homePlayers, ...awayPlayers].some((p) => p.picked);

  const handleOpen = () => {
    onOpen();
    onOpened?.(fixture);
  };

  return (
    <>
      {isOpen && (
        <DashboardCurrentFixtureModal
          live
          minutes={minutes}
          isOpen={isOpen}
          onClose={onClose}
          fixture={fixture}
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
          <Flex
            as="section"
            aria-label="teams"
            my={2}
            flexGrow={1}
            width="100%"
            alignItems="center"
            justifyContent="space-around"
          >
            <Box fontWeight="black" textAlign="center" aria-label="home team">
              <Box
                py={1}
                px={2}
                fontSize="sm"
                layerStyle={`fpl-team-${fixture.team_h?.short_name}`}
                aria-labe="team name"
              >
                {fixture.team_h?.short_name}
              </Box>
              <Box fontSize="4xl" aria-label="score">
                {fixture.team_h_score ?? 0}
              </Box>
            </Box>
            <VStack mx={2} textAlign="center" aria-label="fixture status">
              <Badge colorScheme="red">Live</Badge>
              <Box fontSize="sm" layerStyle="subtitle">
                {minutes}"
              </Box>
              {isPicked && <Badge>Picked</Badge>}
            </VStack>
            <Box fontWeight="black" textAlign="center" aria-label="away team">
              <Box
                py={1}
                px={2}
                fontSize="sm"
                layerStyle={`fpl-team-${fixture.team_a?.short_name}`}
                aria-label="team name"
              >
                {fixture.team_a?.short_name}
              </Box>
              <Box fontSize="4xl" aria-label="score">
                {fixture.team_a_score ?? 0}
              </Box>
            </Box>
          </Flex>
          <Flex
            as="section"
            aria-label="player statistics"
            fontSize="xs"
            height="120px"
            layerStyle="subtitle"
            overflow="hidden"
          >
            <Box width="50%" aria-label="home team">
              {homePlayers?.map((e) => (
                <DashboardFixturePlayerStat
                  key={e.player.id}
                  playerStat={e}
                  align="left"
                />
              ))}
            </Box>
            <Box width="50%" aria-label="away team">
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

export default DashboardLiveFixture;
