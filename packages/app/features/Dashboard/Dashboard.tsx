import {
  Badge,
  Box,
  BoxProps,
  Flex,
  StatArrow,
  Tab,
  TabList,
  TabPanel,
  TabPanels,
  Tabs,
} from "@chakra-ui/react";
import { AnalyticsDashboard } from "@open-fpl/app/features/Analytics/analyticsTypes";
import {
  EntryApiResponse,
  EntryEventPickApiResponse,
} from "@open-fpl/app/features/Api/apiTypes";
import DashboardCurrentGameweek from "@open-fpl/app/features/Dashboard/DashboardCurrentGameweek";
import { dehydrateDashboardFixtures } from "@open-fpl/app/features/Dashboard/dashboardFixtures";
import DashboardNextGameweek from "@open-fpl/app/features/Dashboard/DashboardNextGameweek";
import DashboardToolbar from "@open-fpl/app/features/Dashboard/DashboardToolbar";
import {
  DashboardFixture,
  FixturePlayerStat,
  GameweekPlayerStat,
  RemoteDashboardFixture,
} from "@open-fpl/app/features/Dashboard/dashboardTypes";
import {
  adjustTeamsStrength,
  makeFullFixtures,
} from "@open-fpl/app/features/Fixtures/fixturesData";
import { hydrateClientData } from "@open-fpl/app/features/PlayerData/playerData";
import { useSettings } from "@open-fpl/app/features/Settings/Settings";
import { TeamFixtures } from "@open-fpl/data/features/AppData/fixtureDataTypes";
import { Player } from "@open-fpl/data/features/AppData/playerDataTypes";
import { Team } from "@open-fpl/data/features/AppData/teamDataTypes";
import { Event } from "@open-fpl/data/features/RemoteData/fplTypes";
import formatDistanceToNowStrict from "date-fns/formatDistanceToNowStrict";
import { usePlausible } from "next-plausible";
import { useEffect, useMemo, useState } from "react";
import useSWR from "swr";

const getCountdownText = (deadline: Date) => {
  return deadline >= new Date()
    ? `In ${formatDistanceToNowStrict(deadline, {
        roundingMethod: "floor",
      })}`
    : "Now";
};

const Dashboard = ({
  players: remotePlayers,
  teams,
  teamFixtures,
  currentGameweek,
  currentGameweekFixtures: remoteCurrentGameweekFixtures,
  nextGameweek,
  nextGameweekFixtures: remoteNextGameweekFixtures,
  ...props
}: BoxProps & {
  players: Player[];
  teams: Team[];
  teamFixtures: TeamFixtures[];
  currentGameweek: Event | null;
  currentGameweekFixtures: RemoteDashboardFixture[] | null;
  nextGameweek: Event;
  nextGameweekFixtures: RemoteDashboardFixture[];
}) => {
  const plausible = usePlausible<AnalyticsDashboard>();
  const { profile, teamsStrength, preference, setPreference } = useSettings();

  const { data: entryResponse } = useSWR<EntryApiResponse>(() =>
    profile ? `/api/entries/${profile}` : null
  );
  const entry = entryResponse?.data;

  const { data: currentPicksResponse } = useSWR<EntryEventPickApiResponse>(() =>
    currentGameweek && profile
      ? `/api/entries/${profile}/picks/${currentGameweek.id}`
      : null
  );
  const currentPicks = currentPicksResponse?.data;

  const adjustedTeams = useMemo(
    () => adjustTeamsStrength(teams, teamsStrength),
    [teams, teamsStrength]
  );

  const fullFixtures = useMemo(
    () =>
      makeFullFixtures({
        teamFixtures,
        teams: adjustedTeams,
      }),
    [teams, teamsStrength]
  );

  const players = useMemo(
    () =>
      hydrateClientData(
        remotePlayers,
        preference?.starredPlayers || ([] as number[]),
        [],
        fullFixtures
      ),
    [remotePlayers, preference?.starredPlayers, fullFixtures]
  );

  const { currentGameweekFixtures, nextGameweekFixtures } = useMemo(() => {
    return dehydrateDashboardFixtures(
      remoteCurrentGameweekFixtures,
      remoteNextGameweekFixtures,
      players,
      adjustedTeams,
      currentPicks
    );
  }, [
    remoteCurrentGameweekFixtures,
    remoteNextGameweekFixtures,
    players,
    adjustedTeams,
    currentPicks,
  ]);

  const [liveFixtures, finishedCurrentFixtures, unfinishedCurrentFixtures] =
    useMemo(() => {
      const liveFixtures: DashboardFixture[] = [];
      const finishedCurrentFixtures: DashboardFixture[] = [];
      const unfinishedCurrentFixtures: DashboardFixture[] = [];
      currentGameweekFixtures?.forEach((f) => {
        if (f.live) {
          liveFixtures.push(f);
        } else if (f.finished_provisional) {
          finishedCurrentFixtures.push(f);
        } else {
          unfinishedCurrentFixtures.push(f);
        }
      });
      return [liveFixtures, finishedCurrentFixtures, unfinishedCurrentFixtures];
    }, [currentGameweekFixtures]);

  const allCurrentGameweekPlayers = useMemo(() => {
    const playerStats: GameweekPlayerStat[] = [];
    [...finishedCurrentFixtures, ...liveFixtures].forEach((fixture) => {
      [...fixture.team_h_players, ...fixture.team_a_players].forEach(
        (playerStat) => {
          const matched = playerStats.find(
            (ps) => ps.player.id === playerStat.player.id
          );
          if (matched) {
            matched.fixtures.push(playerStat);
            matched.live = matched.live || playerStat.live;
            if (matched.stats) {
              matched.stats.bps += playerStat.stats?.bps ?? 0;
              matched.stats.goals_scored += playerStat.stats?.goals_scored ?? 0;
              matched.stats.assists += playerStat.stats?.assists ?? 0;
              matched.stats.yellow_cards += playerStat.stats?.yellow_cards ?? 0;
              matched.stats.red_cards += playerStat.stats?.red_cards ?? 0;
              matched.stats.bonus += playerStat.stats?.bonus ?? 0;
              matched.stats.total_points += playerStat.stats?.total_points ?? 0;
              matched.stats.minutes += playerStat.stats?.minutes ?? 0;
            }
          } else {
            playerStats.push({
              player: playerStat.player,
              picked: playerStat.picked,
              multiplier: playerStat.multiplier,
              live: playerStat.live,
              stats: {
                bps: playerStat.stats?.bps ?? 0,
                goals_scored: playerStat.stats?.goals_scored ?? 0,
                assists: playerStat.stats?.assists ?? 0,
                yellow_cards: playerStat.stats?.yellow_cards ?? 0,
                red_cards: playerStat.stats?.red_cards ?? 0,
                bonus: playerStat.stats?.bonus ?? 0,
                total_points: playerStat.stats?.total_points ?? 0,
                minutes: playerStat.stats?.minutes ?? 0,
              },
              fixtures: [playerStat],
            });
          }
        }
      );
    });
    return playerStats;
  }, [liveFixtures, finishedCurrentFixtures]);

  const currentPicksPlayers = useMemo(() => {
    return (
      currentPicks?.map((p) => {
        return allCurrentGameweekPlayers.find((s) => p.element === s.player.id);
      }) ?? []
    ).filter((x) => x) as GameweekPlayerStat[];
  }, [currentPicks, allCurrentGameweekPlayers]);

  const existingPoints = entry?.summary_overall_points ?? 0;
  const livePoints = useMemo(() => {
    const livePlayers: FixturePlayerStat[] = [];
    liveFixtures.forEach((fixture) => {
      livePlayers.push(...fixture.team_a_players);
      livePlayers.push(...fixture.team_h_players);
    });

    return livePlayers.reduce((sum, playerStats) => {
      return (
        sum +
        (playerStats.picked && playerStats.stats
          ? playerStats.stats.total_points * playerStats.multiplier
          : 0)
      );
    }, 0);
  }, [liveFixtures]);
  const totalPoints = existingPoints + livePoints;

  const deadline = new Date(nextGameweek.deadline_time);
  const [countdown, setCountdown] = useState(getCountdownText(deadline));

  useEffect(() => {
    const interval = setInterval(() => {
      setCountdown(getCountdownText(deadline));
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  const [tabIndex, setTabIndex] = useState(
    preference?.selectedDashboardTab ?? 0
  ); // To make changing tab work even without user profile
  const handleTabsChange = (selectedDashboardTab: number) => {
    setTabIndex(selectedDashboardTab);
    if (preference) {
      setPreference({
        ...preference,
        selectedDashboardTab,
      });
    }
    if (selectedDashboardTab === 0) plausible("dashboard-current-gw-open");
    if (selectedDashboardTab === 1) plausible("dashboard-next-gw-open");
  };

  useEffect(() => {
    if (preference?.selectedDashboardTab !== undefined) {
      setTabIndex(preference?.selectedDashboardTab);
    }
  }, [preference?.selectedDashboardTab]);

  return (
    <Flex flexDirection="column" height="100%" {...props}>
      <DashboardToolbar display={{ base: "flex", sm: "none" }} />
      <Tabs
        variant="enclosed-colored"
        flexGrow={1}
        overflow="hidden"
        display="flex"
        flexDirection="column"
        index={tabIndex}
        onChange={handleTabsChange}
      >
        <TabList>
          <Tab
            py={4}
            px={6}
            ml={{ base: 0, sm: 2 }}
            flexBasis={{ base: "50%", sm: "200px" }}
            flexDirection="column"
          >
            {entry ? (
              <>
                <Box
                  as="span"
                  fontSize="sm"
                  alignSelf="flex-start"
                  opacity={0.8}
                >
                  {liveFixtures.length > 0 ? (
                    <>
                      <Badge colorScheme="red" mr={1}>
                        Live
                      </Badge>{" "}
                      Gameweek
                    </>
                  ) : (
                    "This Gameweek"
                  )}
                </Box>
                <Box as="span" alignSelf="flex-end">
                  {liveFixtures.length > 0 ? (
                    <Box as="span" fontSize="sm" mr={4}>
                      <StatArrow type="increase" />
                      {livePoints}
                    </Box>
                  ) : null}
                  <Box as="span" fontSize="xl" fontWeight="black">
                    {totalPoints}
                  </Box>
                </Box>
              </>
            ) : (
              <Box as="span" fontWeight="bold" alignSelf="flex-start">
                Current Gameweek
              </Box>
            )}
          </Tab>
          <Tab
            py={4}
            px={6}
            flexBasis={{ base: "50%", sm: "200px" }}
            flexDirection="column"
            alignItems="flex-start"
          >
            <Box as="span" fontSize="sm" alignSelf="flex-start" opacity={0.8}>
              Next Gameweek
            </Box>
            <Box
              as="span"
              fontSize="xl"
              fontWeight="black"
              alignSelf="flex-end"
            >
              {countdown}
            </Box>
          </Tab>
        </TabList>
        <TabPanels flexGrow={1} overflow="auto">
          <TabPanel>
            <DashboardCurrentGameweek
              entry={entry}
              currentPicks={currentPicks}
              totalPoints={totalPoints}
              livePoints={livePoints}
              liveFixtures={liveFixtures}
              finishedCurrentFixtures={finishedCurrentFixtures}
              unfinishedCurrentFixtures={unfinishedCurrentFixtures}
              allCurrentGameweekPlayers={allCurrentGameweekPlayers}
              currentPicksPlayers={currentPicksPlayers}
            />
          </TabPanel>
          <TabPanel>
            <DashboardNextGameweek
              deadline={deadline}
              nextGameweekFixtures={nextGameweekFixtures}
              allCurrentGameweekPlayers={allCurrentGameweekPlayers}
            />
          </TabPanel>
        </TabPanels>
      </Tabs>
    </Flex>
  );
};

export default Dashboard;
