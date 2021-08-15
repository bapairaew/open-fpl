import { Box, BoxProps, Flex, Grid, Heading } from "@chakra-ui/react";
import {
  AppFixture,
  AppLive,
  EntryApiResponse,
  EntryEventPickApiResponse,
  FixtureeApiResponse,
  LiveApiResponse,
} from "@open-fpl/app/features/Api/apiTypes";
import DashboardFinishedFixture from "@open-fpl/app/features/Dashboard/DashboardFinishedFixture";
import DashboardLiveFixture from "@open-fpl/app/features/Dashboard/DashboardLiveFixture";
import DashboardLivePoints from "@open-fpl/app/features/Dashboard/DashboardLivePoints";
import DashboardToolbar from "@open-fpl/app/features/Dashboard/DashboardToolbar";
import DashboardUpcomingFixture from "@open-fpl/app/features/Dashboard/DashboardUpcomingFixture";
import DeadlineCountdown from "@open-fpl/app/features/Dashboard/DeadlineCountdown";
import { adjustTeamsStrength } from "@open-fpl/app/features/Fixtures/fixturesData";
import { useSettings } from "@open-fpl/app/features/Settings/Settings";
import { Player } from "@open-fpl/data/features/AppData/playerDataTypes";
import { Team } from "@open-fpl/data/features/AppData/teamDataTypes";
import { Event } from "@open-fpl/data/features/RemoteData/fplTypes";
import { useMemo } from "react";
import useSWR from "swr";

const Dashboard = ({
  players,
  teams,
  live,
  currentGameweek,
  currentFixtures,
  nextGameweek,
  nextFixtures,
  ...props
}: BoxProps & {
  players: Player[];
  teams: Team[];
  nextGameweek: Event;
  nextFixtures: AppFixture[];
  live: AppLive | null;
  currentGameweek: Event | null;
  currentFixtures: AppFixture[] | null;
}) => {
  const { profile, teamsStrength } = useSettings();

  const adjustedTeams = useMemo(
    () => adjustTeamsStrength(teams, teamsStrength),
    [teams, teamsStrength]
  );

  const [liveFixtures, finishedCurrentFixtures, unfinishedCurrentFixtures] =
    useMemo(() => {
      const liveFixtures: AppFixture[] = [];
      const finishedCurrentFixtures: AppFixture[] = [];
      const unfinishedCurrentFixtures: AppFixture[] = [];
      currentFixtures?.forEach((f) => {
        if (f.started && !f.finished_provisional) {
          liveFixtures.push(f);
        } else if (f.finished_provisional) {
          finishedCurrentFixtures.push(f);
        } else {
          unfinishedCurrentFixtures.push(f);
        }
      });
      return [liveFixtures, finishedCurrentFixtures, unfinishedCurrentFixtures];
    }, [currentFixtures]);

  const { data: entryResponse = {}, error: entryError } =
    useSWR<EntryApiResponse>(() =>
      profile ? `/api/entries/${profile}` : null
    );
  const entry = entryResponse?.data;

  const { data: currentPicksResponse, error: currentPicksError } =
    useSWR<EntryEventPickApiResponse>(() =>
      currentGameweek && profile
        ? `/api/entries/${profile}/picks/${currentGameweek.id}`
        : null
    );
  const currentPicks = currentPicksResponse?.data;

  return (
    <Flex flexDirection="column" height="100%" {...props}>
      <DashboardToolbar />
      <Box flexGrow={1} overflow="auto">
        <Grid gap={4} p={4}>
          {profile && (
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
                    teams={adjustedTeams}
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
                  <DashboardFinishedFixture
                    key={fixture.id}
                    fixture={fixture}
                    teams={adjustedTeams}
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
                    teams={adjustedTeams}
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
                teams={adjustedTeams}
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
