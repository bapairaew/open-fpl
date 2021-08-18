import {
  Badge,
  Grid,
  Heading,
  Stat,
  StatArrow,
  StatHelpText,
  StatLabel,
  StatNumber,
  Button,
  Flex,
  useDisclosure,
  Box,
} from "@chakra-ui/react";
import {
  ApiEntry,
  ApiEntryEventPick,
} from "@open-fpl/app/features/Api/apiTypes";
import DashboardFinishedFixture from "@open-fpl/app/features/Dashboard/DashboardFinishedFixture";
import DashboardLiveFixture from "@open-fpl/app/features/Dashboard/DashboardLiveFixture";
import DashboardTopPerformers from "@open-fpl/app/features/Dashboard/DashboardTopPerformers";
import {
  DashboardFixture,
  GameweekPlayerStat,
} from "@open-fpl/app/features/Dashboard/dashboardTypes";
import DashboardUpcomingFixture from "@open-fpl/app/features/Dashboard/DashboardUpcomingFixture";
import DashboardLivePointsModal from "@open-fpl/app/features/Dashboard/DashboardLivePointsModal";
import DashboardTeamsheet from "@open-fpl/app/features/Dashboard/DashboardTeamsheet";

const DashboardCurrentGameweek = ({
  entry,
  currentPicks,
  totalPoints,
  livePoints,
  liveFixtures,
  finishedCurrentFixtures,
  unfinishedCurrentFixtures,
  allCurrentGameweekPlayers,
}: {
  entry?: ApiEntry;
  currentPicks?: ApiEntryEventPick[];
  totalPoints: number;
  livePoints: number;
  liveFixtures: DashboardFixture[];
  finishedCurrentFixtures: DashboardFixture[];
  unfinishedCurrentFixtures: DashboardFixture[];
  allCurrentGameweekPlayers: GameweekPlayerStat[];
}) => {
  const isLive = liveFixtures.length > 0;

  const { isOpen, onOpen, onClose } = useDisclosure();

  return (
    <Grid gap={8} py={4}>
      <Grid
        my={8}
        gap={4}
        templateColumns={{
          base: "repeat(2, 1fr)",
          sm: "repeat(4, 1fr)",
          md: "repeat(4, 1fr)",
          xl: "repeat(6, 1fr)",
        }}
      >
        <Stat textAlign="center">
          <StatLabel>Total points</StatLabel>
          <StatNumber fontSize="4xl">{totalPoints.toLocaleString()}</StatNumber>
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
              <Badge colorScheme="gray">Not live</Badge>
            </StatHelpText>
          )}
        </Stat>
        <Box>
          <DashboardTeamsheet
            currentPicks={currentPicks}
            allCurrentGameweekPlayers={allCurrentGameweekPlayers}
          />
        </Box>
      </Grid>
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
          {isOpen && (
            <DashboardLivePointsModal
              isOpen={isOpen}
              onClose={onClose}
              allCurrentGameweekPlayers={allCurrentGameweekPlayers}
            />
          )}
          <Flex justifyContent="space-between">
            <Heading size="md" fontWeight="black">
              Top Performers
            </Heading>
            <Button variant="link" onClick={onOpen}>
              See all
            </Button>
          </Flex>
          <DashboardTopPerformers
            allCurrentGameweekPlayers={allCurrentGameweekPlayers}
          />
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
  );
};

export default DashboardCurrentGameweek;
