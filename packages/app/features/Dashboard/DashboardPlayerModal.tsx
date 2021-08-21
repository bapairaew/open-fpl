import {
  Drawer,
  DrawerBody,
  DrawerCloseButton,
  DrawerContent,
  DrawerHeader,
  DrawerOverlay,
  Box,
  Flex,
  Text,
  Stat,
  StatArrow,
  StatHelpText,
  StatLabel,
  StatNumber,
  Grid,
  Heading,
  Divider,
} from "@chakra-ui/react";
import { MatchStat } from "@open-fpl/data/features/AppData/playerDataTypes";
import {
  FixturePlayerStat,
  GameweekPlayerStat,
} from "@open-fpl/app/features/Dashboard/dashboardTypes";
import PlayerGridCard from "@open-fpl/app/features/PlayerData/PlayerGridCard";
import { useMemo, Fragment } from "react";

type FixtureWithStats = { fixture: FixturePlayerStat; stats: MatchStat };

const DashboardPlayerModal = ({
  isOpen,
  onClose,
  playerStat,
}: {
  isOpen: boolean;
  onClose: () => void;
  playerStat: GameweekPlayerStat;
}) => {
  const fixtureWithStats = useMemo(() => {
    const fixtureWithStats: FixtureWithStats[] = [];
    playerStat.player.linked_data?.past_matches?.forEach((match) => {
      const matched = playerStat.fixtures.find(
        (f) => f.opponent.id === match.opponent_id
      );
      if (matched) {
        fixtureWithStats.push({
          fixture: matched,
          stats: match,
        });
      }
    });
    return fixtureWithStats;
  }, [playerStat]);

  return (
    <Drawer size="sm" isOpen={isOpen} onClose={onClose}>
      <DrawerOverlay />
      <DrawerContent>
        <DrawerHeader />
        <DrawerCloseButton />
        <DrawerBody p={0}>
          <Box width="100%" my={8}>
            <Box maxWidth="300px" mx="auto">
              <PlayerGridCard player={playerStat.player} />
            </Box>
          </Box>
          <Divider />
          {fixtureWithStats.map((fixtureWithStat) => (
            <Fragment key={fixtureWithStat.stats.opponent_id}>
              <Box my={8} maxWidth="300px" mx="auto">
                <Heading
                  size="md"
                  fontWeight="black"
                  textAlign="center"
                  p={2}
                  my={4}
                  layerStyle="highlight"
                >
                  {[
                    fixtureWithStat.fixture.fixture.team_h?.short_name,
                    fixtureWithStat.fixture.fixture.team_h_score,
                    "-",
                    fixtureWithStat.fixture.fixture.team_a_score,
                    fixtureWithStat.fixture.fixture.team_a?.short_name,
                  ].join(" ")}
                </Heading>
                <Grid templateColumns="repeat(3, 1fr)" gap={4}>
                  <Stat textAlign="center">
                    <StatLabel>Goals</StatLabel>
                    <StatNumber fontSize="4xl">
                      {fixtureWithStat.stats.match_g}
                    </StatNumber>
                    <StatHelpText>
                      xG: {fixtureWithStat.stats.match_xg?.toFixed(2)}
                    </StatHelpText>
                  </Stat>
                  <Stat textAlign="center">
                    <StatLabel>Assists</StatLabel>
                    <StatNumber fontSize="4xl">
                      {fixtureWithStat.stats.match_a}
                    </StatNumber>
                    <StatHelpText>
                      xA: {fixtureWithStat.stats.match_xa?.toFixed(2)}
                    </StatHelpText>
                  </Stat>
                  <Stat textAlign="center">
                    <StatLabel>Conceded</StatLabel>
                    <StatNumber fontSize="4xl">
                      {fixtureWithStat.stats.match_ga}
                    </StatNumber>
                    <StatHelpText>
                      xGA: {fixtureWithStat.stats.match_xga?.toFixed(2)}
                    </StatHelpText>
                  </Stat>
                  <Stat textAlign="center">
                    <StatLabel>Shots</StatLabel>
                    <StatNumber fontSize="4xl">
                      {fixtureWithStat.stats.match_shots}
                    </StatNumber>
                  </Stat>
                  <Stat textAlign="center">
                    <StatLabel>Key passes</StatLabel>
                    <StatNumber fontSize="4xl">
                      {fixtureWithStat.stats.match_key_passes}
                    </StatNumber>
                  </Stat>
                  <Stat textAlign="center">
                    <StatLabel>Mintues</StatLabel>
                    <StatNumber fontSize="4xl">
                      {fixtureWithStat.fixture.stats?.minutes}
                    </StatNumber>
                  </Stat>
                  <Stat textAlign="center" gridColumn="span 3">
                    <StatLabel>Points</StatLabel>
                    <StatNumber fontSize="4xl">
                      {fixtureWithStat.fixture.stats?.total_points}
                    </StatNumber>
                  </Stat>
                </Grid>
              </Box>
              <Divider />
            </Fragment>
          ))}
        </DrawerBody>
      </DrawerContent>
    </Drawer>
  );
};

export default DashboardPlayerModal;
