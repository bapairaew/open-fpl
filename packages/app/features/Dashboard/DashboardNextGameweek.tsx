import {
  Button,
  Flex,
  Grid,
  Heading,
  HStack,
  useDisclosure,
  Box,
} from "@chakra-ui/react";
import DashboardPlayerTransfersCard from "@open-fpl/app/features/Dashboard/DashboardPlayerTransfersCard";
import DashboardPlayerTransfersModal from "@open-fpl/app/features/Dashboard/DashboardPlayerTransfersModal";
import {
  DashboardFixture,
  GameweekPlayerStat,
} from "@open-fpl/app/features/Dashboard/dashboardTypes";
import DashboardUpcomingFixture from "@open-fpl/app/features/Dashboard/DashboardUpcomingFixture";
import DeadlineCountdown from "@open-fpl/app/features/Dashboard/DeadlineCountdown";
import { useMemo } from "react";
import { usePlausible } from "next-plausible";
import { AnalyticsDashboard } from "@open-fpl/app/features/Analytics/analyticsTypes";

const DashboardNextGameweek = ({
  deadline,
  nextGameweekFixtures,
  allGameweekPlayers,
}: {
  deadline: Date;
  nextGameweekFixtures: DashboardFixture[];
  allGameweekPlayers: GameweekPlayerStat[];
}) => {
  const plausible = usePlausible<AnalyticsDashboard>();
  const sortedPlayers = useMemo(
    () =>
      [...allGameweekPlayers].sort((a, b) => {
        const aAbsCost = Math.abs(a.player.cost_change_event ?? 0);
        const bAbsCost = Math.abs(b.player.cost_change_event ?? 0);
        if (aAbsCost > bAbsCost) return -1;
        if (aAbsCost < bAbsCost) return 1;

        const aAbsTransfers = Math.abs(
          (a.player.transfers_in_event ?? 0) -
            (a.player.transfers_out_event ?? 0)
        );
        const bAbsTransfers = Math.abs(
          (b.player.transfers_in_event ?? 0) -
            (b.player.transfers_out_event ?? 0)
        );
        if (aAbsTransfers > bAbsTransfers) return -1;
        if (aAbsTransfers < bAbsTransfers) return 1;

        return a.player.selected_by_percent.localeCompare(
          b.player.selected_by_percent
        );
      }),
    [allGameweekPlayers]
  );

  const { onOpen, isOpen, onClose } = useDisclosure();

  const handleSeeAllTopTransfersOpen = () => {
    onOpen();
    plausible("dashboard-next-gw-top-transfers-see-all-open");
  };

  const handleTopTransfersPlayerOpened = () =>
    plausible("dashboard-next-gw-top-transfers-player-open");
  const handleUpcomingFixtureOpened = () =>
    plausible("dashboard-next-gw-upcoming-fixture-open");

  return (
    <>
      {isOpen && (
        <DashboardPlayerTransfersModal
          isOpen={isOpen}
          onClose={onClose}
          players={sortedPlayers}
        />
      )}
      <Grid as="section" aria-label="next gameweek dashboard" gap={8} py={4}>
        <Box my={8}>
          <DeadlineCountdown deadline={deadline} />
        </Box>
        <Flex id="next-gameweek-top-transfers" justifyContent="space-between">
          <Heading size="md" fontWeight="black">
            Top Transfers
          </Heading>
          <Button variant="link" onClick={handleSeeAllTopTransfersOpen}>
            See all
          </Button>
        </Flex>
        <HStack
          as="section"
          role="list"
          aria-labelledby="next-gameweek-top-transfers"
          p={0.5}
          overflowX="scroll"
        >
          {sortedPlayers?.slice(0, 10).map((s) => (
            <DashboardPlayerTransfersCard
              key={s.player.id}
              role="listitem"
              playerStat={s}
              onOpened={handleTopTransfersPlayerOpened}
            />
          ))}
        </HStack>
        <Heading
          id="next-gameweek-fixtures"
          my={2}
          size="md"
          fontWeight="black"
        >
          Next Gameweek
        </Heading>
        <Grid
          as="section"
          role="list"
          aria-labelledby="next-gameweek-fixtures"
          gap={4}
          templateColumns={{
            base: "repeat(1, 1fr)",
            sm: "repeat(2, 1fr)",
            md: "repeat(3, 1fr)",
            xl: "repeat(4, 1fr)",
          }}
        >
          {nextGameweekFixtures.map((fixture) => (
            <DashboardUpcomingFixture
              key={fixture.id}
              role="listitem"
              fixture={fixture}
              onOpened={handleUpcomingFixtureOpened}
            />
          ))}
        </Grid>
      </Grid>
    </>
  );
};

export default DashboardNextGameweek;
