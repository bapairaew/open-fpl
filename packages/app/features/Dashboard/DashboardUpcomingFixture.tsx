import { Box, Flex, Text } from "@chakra-ui/react";
import { Player } from "@open-fpl/data/features/AppData/playerDataTypes";
import {
  EntryEventPick,
  Fixture,
  Team,
} from "@open-fpl/data/features/RemoteData/fplTypes";
import { useMemo } from "react";

const DashboardUpcomingFixture = ({
  fixture,
  fplTeams,
  currentPicks,
  players,
}: {
  fixture: Fixture;
  fplTeams: Team[];
  currentPicks: EntryEventPick[];
  players: Player[];
}) => {
  const home = fplTeams.find((t) => t.id === fixture.team_h);
  const away = fplTeams.find((t) => t.id === fixture.team_a);

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

  const homeTeamPicks: EntryEventPick[] = useMemo(
    () =>
      currentPicks?.filter(
        (p) =>
          players.find((pl) => pl.id === p.element)?.team.id === fixture.team_h
      ) ?? [],
    [currentPicks, fixture, players]
  );
  const awayTeamPicks: EntryEventPick[] = useMemo(
    () =>
      currentPicks?.filter(
        (p) =>
          players.find((pl) => pl.id === p.element)?.team.id === fixture.team_a
      ) ?? [],
    [currentPicks, fixture, players]
  );

  return (
    <Flex
      borderWidth={1}
      px={4}
      py={2}
      borderRadius="md"
      flexDirection="column"
    >
      <Text my={2} layerStyle="subtitle" fontSize="xs" textAlign="left">
        {new Date(fixture.kickoff_time).toLocaleString()}
      </Text>
      <Flex
        my={2}
        flexGrow={1}
        width="100%"
        justifyContent="space-around"
        fontSize="2xl"
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
                layerStyle="bgWithTextColor"
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
                layerStyle="bgWithTextColor"
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
  );
};

export default DashboardUpcomingFixture;
