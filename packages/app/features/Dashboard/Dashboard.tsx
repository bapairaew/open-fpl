import { Box, BoxProps, Flex, Grid, Heading } from "@chakra-ui/react";
import {
  AppEntry,
  AppEntryEventPick,
  AppLive,
} from "@open-fpl/app/features/Api/apiTypes";
import DashboardFixture from "@open-fpl/app/features/Dashboard/DashboardFixture";
import DashboardLiveFixture from "@open-fpl/app/features/Dashboard/DashboardLiveFixture";
import DashboardLivePoints from "@open-fpl/app/features/Dashboard/DashboardLivePoints";
import DashboardToolbar from "@open-fpl/app/features/Dashboard/DashboardToolbar";
import DashboardUpcomingFixture from "@open-fpl/app/features/Dashboard/DashboardUpcomingFixture";
import DeadlineCountdown from "@open-fpl/app/features/Dashboard/DeadlineCountdown";
import { adjustTeamsStrength } from "@open-fpl/app/features/Fixtures/fixturesData";
import { useSettings } from "@open-fpl/app/features/Settings/Settings";
import { Player } from "@open-fpl/data/features/AppData/playerDataTypes";
import {
  Event,
  Fixture,
  Team,
} from "@open-fpl/data/features/RemoteData/fplTypes";
import { useMemo } from "react";
import useSWR from "swr";

const Dashboard = ({
  players,
  fplTeams,
  currentGameweek,
  currentFixtures,
  nextGameweek,
  nextFixtures,
  ...props
}: BoxProps & {
  players: Player[];
  fplTeams: Team[];
  currentGameweek: Event | null;
  currentFixtures: Fixture[];
  nextGameweek: Event;
  nextFixtures: Fixture[];
}) => {
  const { profile, teamsStrength } = useSettings();

  const { data: live, error: liveError } = useSWR<AppLive>(
    () => (currentGameweek ? `/api/live/${currentGameweek.id}` : null),
    {
      refreshInterval: 30 * 1000,
    }
  );

  const { data: entry, error: entryError } = useSWR<AppEntry>(() =>
    profile ? `/api/entries/${profile}` : null
  );

  const { data: currentPicks, error: currentPicksError } = useSWR<
    AppEntryEventPick[]
  >(() =>
    currentGameweek && profile
      ? `/api/entries/${profile}/picks/${currentGameweek.id}`
      : null
  );

  const adjustedTeams = useMemo(
    () => adjustTeamsStrength(fplTeams, teamsStrength),
    [fplTeams, teamsStrength]
  );

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
          {entry && (
            <Grid
              gap={4}
              templateColumns={{
                base: "repeat(1, 1fr)",
                sm: "repeat(2, 1fr)",
                md: "repeat(3, 1fr)",
                xl: "repeat(4, 1fr)",
              }}
            >
              <DashboardLivePoints
                live={live}
                entry={entry}
                currentPicks={currentPicks}
              />
            </Grid>
          )}
          {liveFixtures.length > 0 && (
            <>
              <Heading my={2} size="md" fontWeight="black">
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
                  <DashboardLiveFixture
                    key={fixture.id}
                    live={live}
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
            <DeadlineCountdown nextGameweek={nextGameweek} />
          </Grid>
          <Grid
            gap={4}
            templateColumns={{
              base: "repeat(1, 1fr)",
              sm: "repeat(2, 1fr)",
              md: "repeat(3, 1fr)",
              xl: "repeat(4, 1fr)",
            }}
          >
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
