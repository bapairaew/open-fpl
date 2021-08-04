import { Grid, Box } from "@chakra-ui/react";
import DashboardToolbar from "@open-fpl/app/features/Dashboard/DashboardToolbar";
import DeadlineCountdown from "@open-fpl/app/features/Dashboard/DeadlineCountdown";
import { Event } from "@open-fpl/data/features/RemoteData/fplTypes";

const Dashboard = ({ currentGameweek }: { currentGameweek: Event }) => {
  return (
    <>
      <DashboardToolbar />
      <Grid m={4} templateColumns="repeat(5, 1fr)" gap={4}>
        <DeadlineCountdown currentGameweek={currentGameweek} />
        <Box>Total points</Box>
        <Box>Live global rank + This gameweek rank</Box>
        <Box>Live mini leagues rank</Box>
        <Box>Live matches score + Live matches players points</Box>
        <Box>Other matches in this gameweek</Box>
      </Grid>
    </>
  );
};

export default Dashboard;
