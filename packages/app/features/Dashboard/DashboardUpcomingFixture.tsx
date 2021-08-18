import { Box, Button, Flex, Text, useDisclosure } from "@chakra-ui/react";
import { DashboardFixture } from "@open-fpl/app/features/Dashboard/dashboardTypes";
import DashboardUpcomingFixtureModal from "@open-fpl/app/features/Dashboard/DashboardUpcomingFixtureModal";

const DashboardUpcomingFixture = ({
  fixture,
}: {
  fixture: DashboardFixture;
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

  return (
    <>
      {isOpen && (
        <DashboardUpcomingFixtureModal
          isOpen={isOpen}
          onClose={onClose}
          kickoffTime={kickOffTime}
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
          <Text my={2} layerStyle="subtitle" fontSize="xs" textAlign="left">
            {kickOffTime}
          </Text>
          <Flex
            my={2}
            flexGrow={1}
            width="100%"
            justifyContent="space-around"
            fontSize="xl"
            fontWeight="black"
          >
            <Box>
              <Flex height="6px">
                {homePlayers.map((p) => (
                  <Box
                    key={p.player.id}
                    mx={0.5}
                    width="6px"
                    height="6px"
                    borderRadius="50%"
                    layerStyle="brandSolid"
                  />
                ))}
              </Flex>
              <Box>{fixture.team_h?.short_name}</Box>
            </Box>
            <Box>-</Box>
            <Box>
              <Flex justifyContent="flex-end" height="6px">
                {awayPlayers.map((p) => (
                  <Box
                    key={p.player.id}
                    mx={0.5}
                    width="6px"
                    height="6px"
                    borderRadius="50%"
                    layerStyle="brandSolid"
                  />
                ))}
              </Flex>
              <Box>{fixture.team_a?.short_name}</Box>
            </Box>
          </Flex>
          <Flex width="100%" my={2}>
            <Box
              height="5px"
              width={`${homeDisplayPercent}%`}
              layerStyle={`fpl-team-${fixture.team_h?.short_name}`}
            />
            <Box height="5px" width="4px" layerStyle="sticky" />
            <Box
              height="5px"
              width={`${awayDisplayPercent}%`}
              layerStyle={`fpl-team-${fixture.team_a?.short_name}`}
            />
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

export default DashboardUpcomingFixture;
