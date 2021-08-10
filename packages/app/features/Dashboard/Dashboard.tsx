import { Grid, Heading, Box, BoxProps, Flex } from "@chakra-ui/react";
import { AppLive } from "@open-fpl/app/features/Api/apiTypes";
import DashboardFixture from "@open-fpl/app/features/Dashboard/DashboardFixture";
import DashboardUpcomingFixture from "@open-fpl/app/features/Dashboard/DashboardUpcomingFixture";
import DashboardLivePoints from "@open-fpl/app/features/Dashboard/DashboardLivePoints";
import DashboardToolbar from "@open-fpl/app/features/Dashboard/DashboardToolbar";
import DeadlineCountdown from "@open-fpl/app/features/Dashboard/DeadlineCountdown";
import { adjustTeamsStrength } from "@open-fpl/app/features/Fixtures/fixturesData";
import { useSettings } from "@open-fpl/app/features/Settings/Settings";
import { Player } from "@open-fpl/data/features/AppData/playerDataTypes";
import {
  Entry,
  EntryEventPick,
  Event,
  Fixture,
  Team,
} from "@open-fpl/data/features/RemoteData/fplTypes";
import { useMemo } from "react";
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
  ...props
}: BoxProps & {
  players: Player[];
  fplTeams: Team[];
  entry: Entry;
  currentGameweek: Event | null;
  currentFixtures: Fixture[];
  currentPicks: EntryEventPick[];
  nextGameweek: Event;
  nextFixtures: Fixture[];
}) => {
  const { data: live, error: liveError } = useSWR<AppLive>(() =>
    currentGameweek ? `/api/live/${currentGameweek.id}` : null
  );

  const { teamsStrength } = useSettings();

  const adjustedTeams = useMemo(
    () => adjustTeamsStrength(fplTeams, teamsStrength),
    [fplTeams, teamsStrength]
  );

  const gridTemplate = {
    base: "repeat(1, 1fr)",
    sm: "repeat(2, 1fr)",
    md: "repeat(3, 1fr)",
    xl: "repeat(4, 1fr)",
  };

  const [liveFixtures, finishedCurrentFixtures, unfinishedCurrentFixtures] =
    useMemo(() => {
      const liveFixtures: Fixture[] = [];
      const finishedCurrentFixtures: Fixture[] = [];
      const unfinishedCurrentFixtures: Fixture[] = [];
      currentFixtures?.forEach((f) => {
        if (f.started && !f.finished) {
          liveFixtures.push(f);
        } else if (f.finished) {
          finishedCurrentFixtures.push(f);
        } else {
          unfinishedCurrentFixtures.push(f);
        }
      });
      return [liveFixtures, finishedCurrentFixtures, unfinishedCurrentFixtures];
    }, [currentFixtures]);

  return (
    <Flex flexDirection="column" height="100%" {...props}>
      <DashboardToolbar />
      <Box flexGrow={1} overflow="auto">
        <Grid gap={4} p={4}>
          <Grid gap={4} templateColumns={gridTemplate}>
            <DashboardLivePoints
              live={live}
              entry={entry}
              currentPicks={currentPicks}
            />
          </Grid>
          {liveFixtures.length > 0 && (
            <>
              <Heading my={2} size="md" fontWeight="black">
                Live
              </Heading>
              <Grid gap={4} templateColumns={gridTemplate}>
                {liveFixtures.map((fixture) => (
                  <DashboardFixture
                    key={fixture.id}
                    fixture={fixture}
                    fplTeams={adjustedTeams}
                    currentPicks={currentPicks}
                    players={players}
                  />
                ))}
              </Grid>
            </>
          )}
          {unfinishedCurrentFixtures.length > 0 && (
            <>
              <Heading my={2} size="md" fontWeight="black">
                Upcoming Fixtures
              </Heading>
              <Grid gap={4} templateColumns={gridTemplate}>
                {unfinishedCurrentFixtures.map((fixture) => (
                  <DashboardUpcomingFixture
                    key={fixture.id}
                    fixture={fixture}
                    fplTeams={adjustedTeams}
                    currentPicks={currentPicks}
                    players={players}
                  />
                ))}
              </Grid>
            </>
          )}
          {finishedCurrentFixtures.length > 0 && (
            <>
              <Heading my={2} size="md" fontWeight="black">
                Finished Fixtures
              </Heading>
              <Grid gap={4} templateColumns={gridTemplate}>
                {finishedCurrentFixtures.map((fixture) => (
                  <DashboardFixture
                    key={fixture.id}
                    fixture={fixture}
                    fplTeams={adjustedTeams}
                    currentPicks={currentPicks}
                    players={players}
                  />
                ))}
              </Grid>
            </>
          )}
          <Heading my={2} size="md" fontWeight="black">
            Next Gameweek
          </Heading>
          <Grid gap={4} templateColumns={gridTemplate}>
            <DeadlineCountdown nextGameweek={nextGameweek} />
          </Grid>
          <Grid gap={4} templateColumns={gridTemplate}>
            {nextFixtures.map((fixture) => (
              <DashboardUpcomingFixture
                key={fixture.id}
                fixture={fixture}
                fplTeams={adjustedTeams}
                currentPicks={currentPicks}
                players={players}
              />
            ))}
          </Grid>
        </Grid>
      </Box>
    </Flex>
  );
};

export default Dashboard;
