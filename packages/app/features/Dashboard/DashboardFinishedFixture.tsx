import { Box, Flex, Button, useDisclosure } from "@chakra-ui/react";
import {
  AppEntryEventPick,
  AppFixture,
} from "@open-fpl/app/features/Api/apiTypes";
import DashboardFixturePlayerStat from "@open-fpl/app/features/Dashboard/DashboardFixturePlayerStat";
import DashboardFinishedFixtureModal from "@open-fpl/app/features/Dashboard/DashboardFinishedFixtureModal";
import { Player } from "@open-fpl/data/features/AppData/playerDataTypes";
import { Team } from "@open-fpl/data/features/RemoteData/fplTypes";
import { useMemo } from "react";

const DashboardFinishedFixture = ({
  fixture,
  fplTeams,
  players,
  currentPicks,
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

  const { homePlayersStat, awayPlayersStat } = {
    homePlayersStat: null,
    awayPlayersStat: null,
  };

  const { isOpen, onOpen, onClose } = useDisclosure();

  return (
    <>
      {home && away && isOpen && (
        <DashboardFinishedFixtureModal
          isOpen={isOpen}
          onClose={onClose}
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
          <Flex
            my={2}
            flexGrow={1}
            width="100%"
            justifyContent="space-around"
            fontSize="2xl"
            fontWeight="black"
          >
            <Box>
              <Box>{home?.short_name}</Box>
              <Box
                height="5px"
                width="100%"
                layerStyle={`fpl-team-${home?.short_name}`}
              />
            </Box>
            <Flex fontSize="2xl">
              <Box>{fixture.team_h_score}</Box>
              <Box mx={2}>-</Box>
              <Box>{fixture.team_a_score}</Box>
            </Flex>
            <Box>
              <Box>{away?.short_name}</Box>
              <Box
                height="5px"
                width="100%"
                layerStyle={`fpl-team-${away?.short_name}`}
              />
            </Box>
          </Flex>
          {/* <Flex
            fontSize="xs"
            height="120px"
            layerStyle="subtitle"
            overflow="auto"
          >
            <Box width="50%">
              {homePlayersStat?.map((e) => (
                <DashboardFixturePlayerStat
                  key={e.player.id}
                  playerStat={e}
                  align="left"
                />
              ))}
            </Box>
            <Box width="50%">
              {awayPlayersStat?.map((e) => (
                <DashboardFixturePlayerStat
                  key={e.player.id}
                  playerStat={e}
                  align="right"
                />
              ))}
            </Box>
          </Flex> */}
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
