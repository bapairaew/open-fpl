import {
  Badge,
  Button,
  Flex,
  Grid,
  Heading,
  HStack,
  Stat,
  StatArrow,
  StatHelpText,
  StatLabel,
  StatNumber,
  useDisclosure,
} from "@chakra-ui/react";
import {
  ApiEntry,
  ApiEntryEventPick,
} from "@open-fpl/app/features/Api/apiTypes";
import DashboardFinishedFixture from "@open-fpl/app/features/Dashboard/DashboardFinishedFixture";
import DashboardLiveFixture from "@open-fpl/app/features/Dashboard/DashboardLiveFixture";
import DashboardPlayerCard from "@open-fpl/app/features/Dashboard/DashboardPlayerCard";
import DashboardPlayersModal from "@open-fpl/app/features/Dashboard/DashboardPlayersModal";
import {
  DashboardFixture,
  GameweekPlayerStat,
} from "@open-fpl/app/features/Dashboard/dashboardTypes";
import DashboardUpcomingFixture from "@open-fpl/app/features/Dashboard/DashboardUpcomingFixture";
import { useMemo, useState } from "react";

const DashboardCurrentGameweek = ({
  entry,
  currentPicks,
  totalPoints,
  livePoints,
  liveFixtures,
  finishedCurrentFixtures,
  unfinishedCurrentFixtures,
  allCurrentGameweekPlayers,
  currentPicksPlayers,
}: {
  entry?: ApiEntry;
  currentPicks?: ApiEntryEventPick[];
  totalPoints: number;
  livePoints: number;
  liveFixtures: DashboardFixture[];
  finishedCurrentFixtures: DashboardFixture[];
  unfinishedCurrentFixtures: DashboardFixture[];
  allCurrentGameweekPlayers: GameweekPlayerStat[];
  currentPicksPlayers: GameweekPlayerStat[];
}) => {
  const isLive = liveFixtures.length > 0;

  const { isOpen, onOpen, onClose } = useDisclosure();

  const [playersToDisplay, setPlayersToDisplay] = useState(
    allCurrentGameweekPlayers
  );

  const sortedCurrentGameweekPlayers = useMemo(() => {
    return [...allCurrentGameweekPlayers].sort((a, b) => {
      if ((a.stats?.total_points ?? 0) > (b.stats?.total_points ?? 0))
        return -1;
      if ((a.stats?.total_points ?? 0) < (b.stats?.total_points ?? 0)) return 1;
      if ((a.stats?.bps ?? 0) > (b.stats?.bps ?? 0)) return -1;
      if ((a.stats?.bps ?? 0) < (b.stats?.bps ?? 0)) return 1;
      return 0;
    });
  }, [allCurrentGameweekPlayers]);

  const onOpenWithAllPlayers = () => {
    setPlayersToDisplay(allCurrentGameweekPlayers);
    onOpen();
  };
  const onOpenWithPickedPlayers = () => {
    setPlayersToDisplay(currentPicksPlayers);
    onOpen();
  };

  return (
    <>
      {isOpen && (
        <DashboardPlayersModal
          isOpen={isOpen}
          onClose={onClose}
          players={playersToDisplay}
        />
      )}
      <Grid gap={8} py={4}>
        {entry && (
          <Grid
            my={8}
            gap={4}
            templateColumns={{
              base: "repeat(2, 1fr)",
              sm: "repeat(2, 1fr)",
              md: "repeat(4, 1fr)",
              xl: "repeat(6, 1fr)",
            }}
          >
            <Stat textAlign="center">
              <StatLabel>Total points</StatLabel>
              <StatNumber fontSize="4xl">
                {totalPoints.toLocaleString()}
              </StatNumber>
              {isLive && (
                <StatHelpText>
                  <StatArrow type="increase" />
                  {livePoints.toLocaleString()}
                  <Badge colorScheme="red" ml={2}>
                    Live
                  </Badge>
                </StatHelpText>
              )}
            </Stat>
            <Stat textAlign="center">
              <StatLabel>Overall rank</StatLabel>
              <StatNumber fontSize="4xl">
                {entry?.summary_overall_rank?.toLocaleString() ?? 0}
              </StatNumber>
              {isLive && (
                <StatHelpText>
                  <Badge colorScheme="gray">Update after games</Badge>
                </StatHelpText>
              )}
            </Stat>
          </Grid>
        )}
        {currentPicks && (
          <>
            <Flex justifyContent="space-between">
              <Heading size="md" fontWeight="black">
                Your team
              </Heading>
              <Button variant="link" onClick={onOpenWithPickedPlayers}>
                See all
              </Button>
            </Flex>
            <HStack p={0.5} overflowX="scroll">
              {currentPicksPlayers?.map((s) => (
                <DashboardPlayerCard key={s.player.id} playerStat={s} />
              ))}
            </HStack>
          </>
        )}
        {liveFixtures.length > 0 && (
          <>
            <Heading size="md" fontWeight="black">
              Live
            </Heading>
            <Grid
              gap={4}
              templateColumns={{
                base: "repeat(1, 1fr)",
                sm: "repeat(1, 1fr)",
                md: "repeat(2, 1fr)",
                xl: "repeat(3, 1fr)",
              }}
            >
              {liveFixtures.map((fixture) => (
                <DashboardLiveFixture key={fixture.id} fixture={fixture} />
              ))}
            </Grid>
          </>
        )}
        {allCurrentGameweekPlayers.length > 0 && (
          <>
            <Flex justifyContent="space-between">
              <Heading size="md" fontWeight="black">
                Top Players
              </Heading>
              <Button variant="link" onClick={onOpenWithAllPlayers}>
                See all
              </Button>
            </Flex>
            <HStack p={0.5} overflowX="scroll">
              {sortedCurrentGameweekPlayers?.slice(0, 10).map((s) => (
                <DashboardPlayerCard key={s.player.id} playerStat={s} />
              ))}
            </HStack>
          </>
        )}
        {finishedCurrentFixtures.length > 0 && (
          <>
            <Heading size="md" fontWeight="black">
              Finished Fixtures
            </Heading>
            <Grid
              gap={4}
              templateColumns={{
                base: "repeat(1, 1fr)",
                sm: "repeat(1, 1fr)",
                md: "repeat(2, 1fr)",
                xl: "repeat(3, 1fr)",
              }}
            >
              {finishedCurrentFixtures.map((fixture) => (
                <DashboardFinishedFixture key={fixture.id} fixture={fixture} />
              ))}
            </Grid>
          </>
        )}
        {unfinishedCurrentFixtures.length > 0 && (
          <>
            <Heading size="md" fontWeight="black">
              Upcoming Fixtures
            </Heading>
            <Grid
              gap={4}
              templateColumns={{
                base: "repeat(1, 1fr)",
                sm: "repeat(2, 1fr)",
                md: "repeat(3, 1fr)",
                xl: "repeat(4, 1fr)",
              }}
            >
              {unfinishedCurrentFixtures.map((fixture) => (
                <DashboardUpcomingFixture key={fixture.id} fixture={fixture} />
              ))}
            </Grid>
          </>
        )}
      </Grid>
    </>
  );
};

export default DashboardCurrentGameweek;
