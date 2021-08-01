import {
  Box,
  BoxProps,
  Button,
  Divider,
  Flex,
  forwardRef,
  HStack,
  Icon,
  IconButton,
  TabList,
  TabListProps,
  TabPanel,
  TabPanels,
  Tabs,
  useDisclosure,
  useToast,
} from "@chakra-ui/react";
import { AnalyticsTeamPlanner } from "@open-fpl/app/features/Analytics/analyticsTypes";
import {
  getLocalStorageItem,
  removeLocalStorageItem,
  setLocalStorageItem,
} from "@open-fpl/app/features/Common/useLocalStorage";
import {
  adjustTeamsStrength,
  makeFullFixtures,
} from "@open-fpl/app/features/Fixtures/fixturesData";
import { AppDrawerOpenButton } from "@open-fpl/app/features/Layout/AppDrawer";
import { hydrateClientData } from "@open-fpl/app/features/PlayerData/playerData";
import { useSettings } from "@open-fpl/app/features/Settings/Settings";
import { getTeamPlanKey } from "@open-fpl/app/features/Settings/storageKeys";
import TeamPlannerPanel from "@open-fpl/app/features/TeamPlanner/TeamPlannerPanel";
import TeamPlannerTab from "@open-fpl/app/features/TeamPlanner/TeamPlannerTab";
import TeamPlansDrawer from "@open-fpl/app/features/TeamPlanner/TeamPlansDrawer";
import { TeamFixtures } from "@open-fpl/data/features/AppData/appDataTypes";
import { Player } from "@open-fpl/data/features/AppData/playerDataTypes";
import {
  EntryChipPlay,
  EntryEventHistory,
  EntryEventPick,
  Team,
  Transfer,
} from "@open-fpl/data/features/RemoteData/fplTypes";
import { usePlausible } from "next-plausible";
import dynamic from "next/dynamic";
import { useEffect, useMemo, useState } from "react";
import {
  IoAdd,
  IoChevronDownOutline,
  IoPersonAddOutline,
} from "react-icons/io5";
import { ItemInterface, ReactSortable } from "react-sortablejs";

const CustomPlayersModal = dynamic(
  () => import("@open-fpl/app/features/CustomPlayer/CustomPlayersModal")
);

const getDefaultName = (teamPlans: string[]) => {
  const maxDefaultNameIndex =
    Math.max(
      0,
      ...teamPlans
        .map((x) => x.match(/Plan (\d+)/)?.[1])
        .map((x) => (x ? +x : 0))
    ) + 1;
  return `Plan ${maxDefaultNameIndex}`;
};

const ForwardableTransferPlannerTabList = forwardRef<TabListProps, "div">(
  (props, ref) => {
    return (
      <TabList ref={ref} pl={2} overflowX="auto" overflowY="hidden">
        {props.children}
      </TabList>
    );
  }
);

const TeamPlanner = ({
  initialPicks,
  entryHistory,
  players: remotePlayers,
  currentGameweek,
  transfers,
  chips,
  fplTeams,
  teamFixtures,
  ...props
}: BoxProps & {
  initialPicks: EntryEventPick[] | null;
  entryHistory: EntryEventHistory | null;
  players: Player[];
  currentGameweek: number;
  transfers: Transfer[];
  chips: EntryChipPlay[];
  fplTeams: Team[];
  teamFixtures: TeamFixtures[];
}) => {
  const plausible = usePlausible<AnalyticsTeamPlanner>();
  const toast = useToast();
  const { teamId, customPlayers, preference, setPreference, teamsStrength } =
    useSettings();

  const teamPlans = preference?.teamPlans ?? ["Plan One"];
  const setTeamPlans = (teamPlans: string[]) => {
    if (preference) {
      setPreference({
        ...preference,
        teamPlans,
      });
    }
  };

  const [tabIndex, setTabIndex] = useState(0);
  const sortableTransferPlans = useMemo<ItemInterface[]>(
    () => teamPlans?.map((id) => ({ id })) ?? [],
    [teamPlans]
  );

  const {
    isOpen: isCustomPlayersOpen,
    onOpen: onCustomPlayersOpen,
    onClose: onCustomPlayersClose,
  } = useDisclosure();

  const {
    isOpen: isTeamPlansOpen,
    onOpen: onTeamPlansOpen,
    onClose: onTeamPlansClose,
  } = useDisclosure();

  const fullFixtures = useMemo(
    () =>
      makeFullFixtures({
        teamFixtures,
        fplTeams: adjustTeamsStrength(fplTeams, teamsStrength),
      }),
    [fplTeams, teamsStrength]
  );

  const players = useMemo(
    () =>
      hydrateClientData(
        remotePlayers,
        preference?.starredPlayers || ([] as number[]),
        customPlayers || [],
        fullFixtures
      ),
    [remotePlayers, preference?.starredPlayers, customPlayers]
  );

  useEffect(() => setTabIndex(0), [teamId]);

  const handleTabsChange = (index: number) => setTabIndex(index);

  const handleAdd = () => {
    if (teamPlans) {
      const nextIndex = teamPlans.length;
      setTeamPlans([...teamPlans, getDefaultName(teamPlans)]);
      setTabIndex(nextIndex);
      plausible("team-planner-plans-add");
    }
  };

  const handleRename = (newName: string, oldName: string) => {
    if (teamPlans && newName !== oldName) {
      const nextTransferPlans = [...teamPlans];
      if (nextTransferPlans.some((p) => p === newName)) {
        toast({
          title: "Name already taken.",
          description: `The name "${newName}" is already taken. Please choose a different name.`,
          status: "error",
          isClosable: true,
        });
        setTeamPlans(nextTransferPlans);
      } else {
        const index = nextTransferPlans.findIndex((p) => p === oldName);
        if (index !== -1) {
          nextTransferPlans[index] = newName;
          setTeamPlans(nextTransferPlans);
          if (teamId) {
            const data = getLocalStorageItem(
              getTeamPlanKey(teamId, oldName),
              []
            );
            setLocalStorageItem(getTeamPlanKey(teamId, newName), data);
            removeLocalStorageItem(getTeamPlanKey(teamId, oldName));
            plausible("team-planner-plans-rename");
          }
        }
      }
    }
  };

  const handleDuplicate = (plan: string) => {
    if (teamPlans) {
      const nextIndex = teamPlans.length;
      const name = getDefaultName(teamPlans);
      setTeamPlans([...teamPlans, name]);
      if (teamId) {
        setLocalStorageItem(
          getTeamPlanKey(teamId, name),
          getLocalStorageItem(getTeamPlanKey(teamId, plan), [])
        );
        setTabIndex(nextIndex);
        plausible("team-planner-plans-duplicate");
      }
    }
  };

  const handleRemove = (plan: string) => {
    if (teamPlans) {
      const nextTransferPlans = teamPlans?.filter((p) => p !== plan);

      if (nextTransferPlans.length === 0) {
        setTeamPlans([getDefaultName(nextTransferPlans)]);
        setTabIndex(0);
      } else {
        setTeamPlans(nextTransferPlans);
        if (tabIndex >= nextTransferPlans.length) {
          setTabIndex(nextTransferPlans.length - 1);
        }
      }

      if (teamId) {
        removeLocalStorageItem(getTeamPlanKey(teamId, plan));
        plausible("team-planner-plans-remove");
      }
    }
  };

  const handleRearrange = (newOrder: ItemInterface[]) => {
    const nextTransferPlans = newOrder.map((i) => `${i.id}`);
    setTeamPlans(nextTransferPlans);
    setTabIndex(
      nextTransferPlans.findIndex((t) => t === teamPlans?.[tabIndex])
    );
    plausible("team-planner-plans-rearrange");
  };

  return (
    <>
      {isCustomPlayersOpen && (
        <CustomPlayersModal
          players={players}
          fplTeams={fplTeams}
          isOpen={isCustomPlayersOpen}
          onClose={onCustomPlayersClose}
        />
      )}
      {isTeamPlansOpen && (
        <TeamPlansDrawer
          isOpen={isTeamPlansOpen}
          onClose={onTeamPlansClose}
          teamPlans={sortableTransferPlans}
          selectedIndex={tabIndex}
          onSelectedIndexChange={setTabIndex}
          onAdd={handleAdd}
          onRename={handleRename}
          onDuplicate={handleDuplicate}
          onRemove={handleRemove}
          onRearrange={handleRearrange}
        />
      )}
      <Box height="100%" width="100%" overflow="hidden" {...props}>
        <Tabs
          variant="enclosed-colored"
          height="100%"
          width="100%"
          display="flex"
          flexDirection="column"
          index={tabIndex}
          onChange={handleTabsChange}
        >
          <Flex bg="gray.50" display={{ base: "none", sm: "flex" }}>
            <ReactSortable
              // NOTE: react-sortablejs typescript is not well-defined so just ignore it
              // @ts-ignore
              tag={ForwardableTransferPlannerTabList}
              list={sortableTransferPlans}
              setList={handleRearrange}
            >
              {sortableTransferPlans?.map(({ id: plan }) => (
                <TeamPlannerTab
                  key={plan}
                  plan={`${plan}`}
                  onNameChange={(newName: string) =>
                    handleRename(newName, `${plan}`)
                  }
                  onRemoveClick={() => handleRemove(`${plan}`)}
                  onDuplicateClick={() => handleDuplicate(`${plan}`)}
                />
              ))}
            </ReactSortable>
            <Flex
              flexGrow={1}
              borderLeftWidth={1}
              justifyContent="space-between"
            >
              <IconButton
                width="60px"
                height="100%"
                variant="ghost"
                borderRadius="none"
                icon={<Icon as={IoAdd} />}
                aria-label="add a new plan"
                onClick={handleAdd}
              />
              <Flex>
                <Divider orientation="vertical" />
                <Box p="2px">
                  <Button
                    size="sm"
                    height="100%"
                    variant="ghost"
                    borderRadius="none"
                    leftIcon={<Icon as={IoPersonAddOutline} />}
                    onClick={onCustomPlayersOpen}
                  >
                    Custom Players
                  </Button>
                </Box>
              </Flex>
            </Flex>
          </Flex>
          <HStack
            height="50px"
            spacing={1}
            px={1}
            display={{ base: "flex", sm: "none" }}
          >
            <AppDrawerOpenButton />
            <Divider orientation="vertical" />
            <Flex flexGrow={1}>
              <Button
                borderRadius="none"
                variant="ghost"
                width="100%"
                justifyContent="space-between"
                rightIcon={<Icon as={IoChevronDownOutline} />}
                onClick={onTeamPlansOpen}
              >
                {teamPlans?.[tabIndex]}
              </Button>
            </Flex>
            <Divider orientation="vertical" />
            <IconButton
              variant="ghost"
              borderRadius="none"
              aria-label="custom players"
              icon={<Icon as={IoPersonAddOutline} />}
              onClick={onCustomPlayersOpen}
            />
          </HStack>
          <TabPanels
            display="flex"
            flexGrow={1}
            flexDirection="column"
            borderTopWidth={1}
          >
            {teamPlans?.map((plan) => (
              <TabPanel
                key={plan}
                p={0}
                flexGrow={1}
                display="flex"
                flexDirection="column"
              >
                {teamId && (
                  <TeamPlannerPanel
                    teamId={teamId}
                    teamPlanKey={plan}
                    initialPicks={initialPicks}
                    entryHistory={entryHistory}
                    players={players}
                    currentGameweek={currentGameweek}
                    transfers={transfers}
                    chips={chips}
                  />
                )}
              </TabPanel>
            ))}
          </TabPanels>
        </Tabs>
      </Box>
    </>
  );
};

export default TeamPlanner;
