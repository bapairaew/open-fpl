import { Grid, Box } from "@chakra-ui/react";
import DashboardToolbar from "@open-fpl/app/features/Dashboard/DashboardToolbar";
import DeadlineCountdown from "@open-fpl/app/features/Dashboard/DeadlineCountdown";
import {
  Event,
  Team,
  Entry,
  EntryEventPick,
  Fixture,
} from "@open-fpl/data/features/RemoteData/fplTypes";
import { Player } from "@open-fpl/data/features/AppData/playerDataTypes";

const Dashboard = ({
  players,
  fplTeams,
  entry,
  currentGameweek,
  currentFixtures,
  currentPicks,
  nextGameweek,
  nextFixtures,
}: {
  players: Player[] | null;
  fplTeams: Team[] | null;
  entry: Entry | null;
  currentGameweek: Event | null;
  currentFixtures: Fixture[] | null;
  currentPicks: EntryEventPick[] | null;
  nextGameweek: Event | null;
  nextFixtures: Fixture[] | null;
}) => {
  return (
    <>
      <DashboardToolbar />
      <Grid
        m={4}
        templateColumns={{
          base: "repeat(1, 1fr)",
          sm: "repeat(2, 1fr)",
          md: "repeat(3, 1fr)",
          lg: "repeat(4, 1fr)",
          xl: "repeat(5, 1fr)",
        }}
        gap={4}
      >
        {nextGameweek && <DeadlineCountdown nextGameweek={nextGameweek} />}
        <Box>Live points</Box>
        <Box>Live matches score + Live matches players points</Box>
        <Box>Other matches in this gameweek</Box>
      </Grid>
    </>
  );
};

export default Dashboard;
