import { Box, Flex, Icon, Badge } from "@chakra-ui/react";
import { Player } from "@open-fpl/data/features/AppData/playerDataTypes";
import {
  EntryEventPick,
  Fixture,
  Team,
} from "@open-fpl/data/features/RemoteData/fplTypes";
import { useMemo } from "react";
import { IoRadioButtonOnOutline } from "react-icons/io5";

const DashboardFixture = ({
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
  const isLive = fixture.started && !fixture.finished;

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
      {isLive ? (
        <Box my={2} layerStyle="subtitle" fontSize="sm" textAlign="left">
          <Badge colorScheme="red" mr={2}>
            <Icon as={IoRadioButtonOnOutline} mr={0.5} mb={0.5} />
            Live
          </Badge>{" "}
          {fixture.minutes}"
        </Box>
      ) : null}
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
        <Box>
          {fixture.team_h_score} - {fixture.team_h_score}
        </Box>
        <Box>
          <Flex>
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
    </Flex>
  );
};

export default DashboardFixture;
