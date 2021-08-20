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

const DashboardNextGameweek = ({
  deadline,
  nextGameweekFixtures,
  allCurrentGameweekPlayers,
}: {
  deadline: Date;
  nextGameweekFixtures: DashboardFixture[];
  allCurrentGameweekPlayers: GameweekPlayerStat[];
}) => {
  const sortedPlayers = useMemo(
    () =>
      allCurrentGameweekPlayers.sort((a, b) => {
        const aAbsCost = Math.abs(a.player.cost_change_event ?? 0);
        const bAbsCost = Math.abs(b.player.cost_change_event ?? 0);
        if (aAbsCost > aAbsCost) return -1;
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
    [allCurrentGameweekPlayers]
  );

  const { onOpen, isOpen, onClose } = useDisclosure();

  return (
    <>
      {isOpen && (
        <DashboardPlayerTransfersModal
          isOpen={isOpen}
          onClose={onClose}
          players={sortedPlayers}
        />
      )}
      <Grid gap={8} py={4}>
        <Box my={8}>
          <DeadlineCountdown deadline={deadline} />
        </Box>
        <Flex justifyContent="space-between">
          <Heading size="md" fontWeight="black">
            Top Transfers
          </Heading>
          <Button variant="link" onClick={onOpen}>
            See all
          </Button>
        </Flex>
        <HStack p={0.5} overflowX="scroll">
          {sortedPlayers?.slice(0, 10).map((s) => (
            <DashboardPlayerTransfersCard key={s.player.id} playerStat={s} />
          ))}
        </HStack>
        <Heading my={2} size="md" fontWeight="black">
          Next Gameweek
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
          {nextGameweekFixtures.map((fixture) => (
            <DashboardUpcomingFixture key={fixture.id} fixture={fixture} />
          ))}
        </Grid>
      </Grid>
    </>
  );
};

export default DashboardNextGameweek;
