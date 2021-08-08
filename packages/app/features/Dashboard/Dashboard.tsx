import { Box, Grid } from "@chakra-ui/react";
import { AppLive } from "@open-fpl/app/features/Api/apiTypes";
import DashboardToolbar from "@open-fpl/app/features/Dashboard/DashboardToolbar";
import DeadlineCountdown from "@open-fpl/app/features/Dashboard/DeadlineCountdown";
import LivePoints from "@open-fpl/app/features/Dashboard/LivePoints";
import { Player } from "@open-fpl/data/features/AppData/playerDataTypes";
import {
  Entry,
  EntryEventPick,
  Event,
  Fixture,
  Team,
} from "@open-fpl/data/features/RemoteData/fplTypes";
import useSWR from "swr";

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
  players: Player[];
  fplTeams: Team[];
  entry: Entry;
  currentGameweek: Event;
  currentFixtures: Fixture[];
  currentPicks: EntryEventPick[];
  nextGameweek: Event;
  nextFixtures: Fixture[];
}) => {
  const { data: live, error: liveError } = useSWR<AppLive>(() =>
    currentGameweek ? `/api/live/${currentGameweek.id}` : null
  );

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
        <DeadlineCountdown nextGameweek={nextGameweek} />
        <LivePoints live={live} entry={entry} currentPicks={currentPicks} />
        <Box>Live matches score + Live matches players points</Box>
        <Box>Other matches in this gameweek</Box>
        {/* <pre>{JSON.stringify(entry, null, 2)}</pre> */}
      </Grid>
    </>
  );
};

export default Dashboard;
