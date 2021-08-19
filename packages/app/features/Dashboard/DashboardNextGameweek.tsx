import { Grid, Heading } from "@chakra-ui/react";
import DashboardUpcomingFixture from "@open-fpl/app/features/Dashboard/DashboardUpcomingFixture";
import DeadlineCountdown from "@open-fpl/app/features/Dashboard/DeadlineCountdown";
import { DashboardFixture } from "@open-fpl/app/features/Dashboard/dashboardTypes";

const DashboardNextGameweek = ({
  countDown,
  nextGameweekFixtures,
}: {
  countDown: string;
  nextGameweekFixtures: DashboardFixture[];
}) => {
  return (
    <>
      <DeadlineCountdown countDown={countDown} />
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
    </>
  );
};

export default DashboardNextGameweek;
