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
import { TeamFixtures } from "@open-fpl/data/features/AppData/fixtureDataTypes";
import { Player } from "@open-fpl/data/features/AppData/playerDataTypes";
import { Team } from "@open-fpl/data/features/AppData/teamDataTypes";
import {
  EntryChipPlay,
  EntryEventHistory,
  EntryEventPick,
  Transfer,
} from "@open-fpl/data/features/RemoteData/fplTypes";
// import { usePlausible } from "next-plausible";
import dynamic from "next/dynamic";
import { useMemo } from "react";
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
  nextGameweekId,
  transfers,
  chips,
  teams,
  teamFixtures,
  ...props
}: BoxProps & {
  initialPicks: EntryEventPick[] | null;
  entryHistory: EntryEventHistory | null;
  players: Player[];
  nextGameweekId: number;
  transfers: Transfer[];
  chips: EntryChipPlay[];
  teams: Team[];
  teamFixtures: TeamFixtures[];
}) => {
  // const plausible = usePlausible<AnalyticsTeamPlanner>();
  const toast = useToast();
  const {
    profile,
    customPlayers,
    preference,
    setPreference,
    teamsStrength,
    useCustomFDR,
  } = useSettings();

  const teamPlans = preference?.teamPlans ?? ["Plan 1"];
  const setTeamPlans = (teamPlans: string[]) => {
    if (preference) {
      setPreference({
        ...preference,
        teamPlans,
      });
    }
  };

  const tabIndex = preference?.selectedPlan ?? 0;
  const setTabIndex = (selectedPlan: number) => {
    if (preference) {
      setPreference({
        ...preference,
        selectedPlan,
      });
    }
  };

  const setTeamPlansAndTabIndex = (
    teamPlans: string[],
    selectedPlan: number
  ) => {
    if (preference) {
      setPreference({
        ...preference,
        teamPlans,
        selectedPlan,
      });
    }
  };

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
        teams: adjustTeamsStrength(teams, teamsStrength),
        useCustomFDR,
      }),
    [teamFixtures, teams, teamsStrength, useCustomFDR]
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

  const handleTabsChange = (index: number) => setTabIndex(index);

  const handleAdd = () => {
    if (teamPlans) {
      const nextIndex = teamPlans.length;
      setTeamPlansAndTabIndex(
        [...teamPlans, getDefaultName(teamPlans)],
        nextIndex
      );
      // plausible("team-planner-plans-add");
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
          if (profile) {
            const data = getLocalStorageItem(
              getTeamPlanKey(profile, oldName),
              []
            );
            setLocalStorageItem(getTeamPlanKey(profile, newName), data);
            removeLocalStorageItem(getTeamPlanKey(profile, oldName));
            // plausible("team-planner-plans-rename");
          }
        }
      }
    }
  };

  const handleDuplicate = (plan: string) => {
    if (teamPlans && profile) {
      const nextIndex = teamPlans.length;
      const name = getDefaultName(teamPlans);
      setTeamPlansAndTabIndex([...teamPlans, name], nextIndex);
      setLocalStorageItem(
        getTeamPlanKey(profile, name),
        getLocalStorageItem(getTeamPlanKey(profile, plan), [])
      );
      // plausible("team-planner-plans-duplicate");
    }
  };

  const handleRemove = (plan: string) => {
    if (teamPlans) {
      const nextTransferPlans = teamPlans?.filter((p) => p !== plan);

      if (nextTransferPlans.length === 0) {
        setTeamPlansAndTabIndex([getDefaultName(nextTransferPlans)], 0);
      } else {
        setTeamPlansAndTabIndex(
          nextTransferPlans,
          tabIndex >= nextTransferPlans.length
            ? nextTransferPlans.length - 1
            : tabIndex
        );
      }

      if (profile) {
        removeLocalStorageItem(getTeamPlanKey(profile, plan));
        // plausible("team-planner-plans-remove");
      }
    }
  };

  const handleRearrange = (newOrder: ItemInterface[]) => {
    const nextTransferPlans = newOrder.map((i) => `${i.id}`);
    setTeamPlansAndTabIndex(
      nextTransferPlans,
      nextTransferPlans.findIndex((t) => t === teamPlans?.[tabIndex])
    );
    // plausible("team-planner-plans-rearrange");
  };

  return (
    <>
      {isCustomPlayersOpen && (
        <CustomPlayersModal
          players={players}
          teams={teams}
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
          aria-label="team plans"
          variant="enclosed-colored"
          height="100%"
          width="100%"
          display="flex"
          flexDirection="column"
          index={tabIndex}
          onChange={handleTabsChange}
        >
          <Flex display={{ base: "none", sm: "flex" }}>
            <ReactSortable
              // NOTE: react-sortablejs typescript is not well-defined so just ignore it
              // @ts-ignore
              tag={ForwardableTransferPlannerTabList}
              list={sortableTransferPlans}
              setList={handleRearrange}
            >
              {sortableTransferPlans?.map(({ id: plan }) => (
                <TeamPlannerTab
                  aria-label={`select plan ${plan}`}
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
                aria-label="open plan options"
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
              aria-label="open custom players menu"
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
                {profile && (
                  <TeamPlannerPanel
                    profile={profile}
                    teamPlanKey={plan}
                    initialPicks={initialPicks}
                    entryHistory={entryHistory}
                    players={players}
                    nextGameweekId={nextGameweekId}
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
