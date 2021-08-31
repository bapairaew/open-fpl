import {
  Box,
  BoxProps,
  Button,
  Flex,
  Text,
  useDisclosure,
} from "@chakra-ui/react";
import { DashboardFixture } from "@open-fpl/app/features/Dashboard/dashboardTypes";
import DashboardUpcomingFixtureModal from "@open-fpl/app/features/Dashboard/DashboardUpcomingFixtureModal";

const DashboardUpcomingFixture = ({
  fixture,
  onOpened,
  ...props
}: BoxProps & {
  fixture: DashboardFixture;
  onOpened?: (fixture: DashboardFixture) => void;
}) => {
  const homeTotalStrength =
    (fixture.team_h?.strength_attack_home ?? 0) +
    (fixture.team_h?.strength_defence_home ?? 0);
  const awayTotalStrength =
    (fixture.team_a?.strength_attack_away ?? 0) +
    (fixture.team_a?.strength_defence_away ?? 0);
  const totalStrength = homeTotalStrength + awayTotalStrength;
  const homePercent = (homeTotalStrength / totalStrength) * 100;
  const awayPercent = (awayTotalStrength / totalStrength) * 100;
  const strengthDiff = Math.round(homePercent - awayPercent);
  const homeDisplayPercent = 50 + 5 * strengthDiff;
  const awayDisplayPercent = 100 - homeDisplayPercent;

  const homePlayers = fixture.team_h_players?.filter((p) => p.picked) ?? [];
  const awayPlayers = fixture.team_a_players?.filter((p) => p.picked) ?? [];

  const kickOffTime = new Date(fixture.kickoff_time).toLocaleString();
  const { isOpen, onOpen, onClose } = useDisclosure();

  const handleOpen = () => {
    onOpen();
    onOpened?.(fixture);
  };

  return (
    <>
      {isOpen && (
        <DashboardUpcomingFixtureModal
          isOpen={isOpen}
          onClose={onClose}
          kickoffTime={kickOffTime}
          fixture={fixture}
          homeDisplayPercent={homeDisplayPercent}
          awayDisplayPercent={awayDisplayPercent}
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
          <Text
            as="span"
            aria-label="kick-off time"
            my={2}
            layerStyle="subtitle"
            fontSize="xs"
            textAlign="left"
          >
            {kickOffTime}
          </Text>
          <Flex
            as="section"
            aria-label="teams"
            my={2}
            flexGrow={1}
            width="100%"
            justifyContent="space-around"
            fontSize="xl"
            fontWeight="black"
          >
            <Box as="section" aria-label="home team">
              <Flex height="6px" aria-label="selected players">
                {homePlayers.slice(0, 3).map((p) => (
                  <Box
                    key={p.player.id}
                    aria-label={p.player.web_name}
                    mx={0.5}
                    width="6px"
                    height="6px"
                    borderRadius="50%"
                    layerStyle="brandSolid"
                  />
                ))}
              </Flex>
              <Box aria-label="team name">{fixture.team_h?.short_name}</Box>
            </Box>
            <Box>-</Box>
            <Box as="section" aria-label="away team">
              <Flex
                justifyContent="flex-end"
                height="6px"
                aria-label="selected players"
              >
                {awayPlayers.slice(0, 3).map((p) => (
                  <Box
                    key={p.player.id}
                    aria-label={p.player.web_name}
                    mx={0.5}
                    width="6px"
                    height="6px"
                    borderRadius="50%"
                    layerStyle="brandSolid"
                  />
                ))}
              </Flex>
              <Box aria-label="team name">{fixture.team_a?.short_name}</Box>
            </Box>
          </Flex>
          <Flex width="100%" my={2} aria-label="teams strength">
            <Box
              aria-label="home team strength"
              aria-valuetext={`${homeDisplayPercent}`}
              height="5px"
              width={`${homeDisplayPercent}%`}
              layerStyle={`fpl-team-${fixture.team_h?.short_name}`}
            />
            <Box height="5px" width="4px" layerStyle="sticky" />
            <Box
              aria-label="away team strength"
              aria-valuetext={`${awayDisplayPercent}`}
              height="5px"
              width={`${awayDisplayPercent}%`}
              layerStyle={`fpl-team-${fixture.team_a?.short_name}`}
            />
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

export default DashboardUpcomingFixture;
