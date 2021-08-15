import { Box, Flex, Text, useDisclosure, Button } from "@chakra-ui/react";
import {
  AppEntryEventPick,
  AppFixture,
} from "@open-fpl/app/features/Api/apiTypes";
import { getHomeAwayPicks } from "@open-fpl/app/features/Dashboard/dashboardFixtures";
import { Player } from "@open-fpl/data/features/AppData/playerDataTypes";
import { Team } from "@open-fpl/data/features/RemoteData/fplTypes";
import { useMemo } from "react";
import DashboardUpcomingFixtureModal from "./DashboardUpcomingFixtureModal";

const DashboardUpcomingFixture = ({
  fixture,
  fplTeams,
  currentPicks,
  players,
}: {
  fixture: AppFixture;
  fplTeams: Team[];
  players: Player[];
  currentPicks?: AppEntryEventPick[];
}) => {
  const { home, away } = useMemo(() => {
    const home = fplTeams.find((t) => t.id === fixture.team_h);
    const away = fplTeams.find((t) => t.id === fixture.team_a);
    return {
      home,
      away,
    };
  }, [fplTeams, fixture]);

  const homeTotalStrength =
    (home?.strength_attack_home ?? 0) + (home?.strength_defence_home ?? 0);
  const awayTotalStrength =
    (away?.strength_attack_away ?? 0) + (away?.strength_defence_away ?? 0);
  const totalStrength = homeTotalStrength + awayTotalStrength;
  const homePercent = (homeTotalStrength / totalStrength) * 100;
  const awayPercent = (awayTotalStrength / totalStrength) * 100;
  const strengthDiff = Math.round(homePercent - awayPercent);
  const homeDisplayPercent = 50 + 5 * strengthDiff;
  const awayDisplayPercent = 100 - homeDisplayPercent;

  const { homeTeamPicks, awayTeamPicks } = useMemo(
    () => getHomeAwayPicks(fixture, players, currentPicks),
    [currentPicks, fixture, players]
  );

  const { isOpen, onOpen, onClose } = useDisclosure();
  const kickOffTime = new Date(fixture.kickoff_time).toLocaleString();

  return (
    <>
      {home && away && isOpen && (
        <DashboardUpcomingFixtureModal
          isOpen={isOpen}
          onClose={onClose}
          kickoffTime={kickOffTime}
          home={home}
          away={away}
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
              <Flex>
                {homeTeamPicks.map((p) => (
                  <Box
                    key={p.element}
                    mx={0.5}
                    width="6px"
                    height="6px"
                    borderRadius="50%"
                    layerStyle="textSolid"
                  />
                ))}
              </Flex>
              <Box>{home?.short_name}</Box>
            </Box>
            <Box>-</Box>
            <Box>
              <Flex justifyContent="flex-end">
                {awayTeamPicks.map((p) => (
                  <Box
                    key={p.element}
                    mx={0.5}
                    width="6px"
                    height="6px"
                    borderRadius="50%"
                    layerStyle="textSolid"
                  />
                ))}
              </Flex>
              <Box>{away?.short_name}</Box>
            </Box>
          </Flex>
          <Flex width="100%" my={2}>
            <Box
              height="5px"
              width={`${homeDisplayPercent}%`}
              layerStyle={`fpl-team-${home?.short_name}`}
            />
            <Box height="5px" width="4px" layerStyle="sticky" />
            <Box
              height="5px"
              width={`${awayDisplayPercent}%`}
              layerStyle={`fpl-team-${away?.short_name}`}
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
