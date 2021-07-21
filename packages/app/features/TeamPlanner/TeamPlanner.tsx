import {
  Box,
  BoxProps,
  Button,
  Divider,
  Flex,
  forwardRef,
  Icon,
  IconButton,
  TabList,
  TabListProps,
  TabPanel,
  TabPanels,
  Tabs,
  useDisclosure,
} from "@chakra-ui/react";
import { useEffect, useMemo, useState } from "react";
import { IoAdd, IoSettingsOutline } from "react-icons/io5";
import { ItemInterface, ReactSortable } from "react-sortablejs";
import { Gameweek } from "@open-fpl/data/features/AppData/appDataTypes";
import {
  getLocalStorageItem,
  removeLocalStorageItem,
  setLocalStorageItem,
} from "@open-fpl/app/features/Common/useLocalStorage";
import CustomPlayersModal from "@open-fpl/app/features/CustomPlayer/CustomPlayersModal";
import { hydrateClientData } from "@open-fpl/app/features/PlayerData/playerData";
import { Player } from "@open-fpl/data/features/AppData/playerDataTypes";
import {
  EntryChipPlay,
  EntryEventHistory,
  EntryEventPick,
  Team,
  Transfer,
} from "@open-fpl/data/features/RemoteData/fplTypes";
import { useSettings } from "@open-fpl/app/features/Settings/SettingsContext";
import { getTeamPlanKey } from "@open-fpl/app/features/Settings/storageKeys";
import TeamPlannerPanel from "@open-fpl/app/features/TeamPlanner/TeamPlannerPanel";
import TeamPlannerTab from "@open-fpl/app/features/TeamPlanner/TeamPlannerTab";

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
      <TabList ref={ref} pl={2}>
        {props.children}
      </TabList>
    );
  }
);

const TeamPlanner = ({
  initialPicks,
  entryHistory,
  players: remotePlayers,
  gameweeks,
  transfers,
  chips,
  fplTeams,
  ...props
}: BoxProps & {
  initialPicks: EntryEventPick[] | null;
  entryHistory: EntryEventHistory | null;
  players: Player[];
  gameweeks: Gameweek[];
  transfers: Transfer[];
  chips: EntryChipPlay[];
  fplTeams: Team[];
}) => {
  const { teamId, teamPlans, starredPlayers, setTeamPlans, customPlayers } =
    useSettings();
  const [tabIndex, setTabIndex] = useState(0);
  const sortableTransferPlans = useMemo<ItemInterface[]>(
    () => teamPlans?.map((id) => ({ id })) ?? [],
    [teamPlans]
  );
  const { isOpen, onOpen, onClose } = useDisclosure();

  const players = useMemo(
    () =>
      starredPlayers && customPlayers
        ? hydrateClientData(remotePlayers, starredPlayers, customPlayers)
        : remotePlayers,
    [remotePlayers, starredPlayers, customPlayers]
  );

  useEffect(() => setTabIndex(0), [teamId]);

  const handleTabsChange = (index: number) => setTabIndex(index);

  const handleAddNewTransferPlan = () => {
    if (teamPlans) {
      const nextIndex = teamPlans.length;
      setTeamPlans([...teamPlans, getDefaultName(teamPlans)]);
      setTabIndex(nextIndex);
    }
  };

  const handleRename = (newName: string, oldName: string) => {
    if (teamPlans && newName !== oldName) {
      const nextTransferPlans = [...teamPlans];
      const index = nextTransferPlans.findIndex((p) => p === oldName);
      if (index !== -1) {
        nextTransferPlans[index] = newName;
        setTeamPlans(nextTransferPlans);
        const data = getLocalStorageItem(getTeamPlanKey(teamId, oldName), []);
        setLocalStorageItem(getTeamPlanKey(teamId, newName), data);
        removeLocalStorageItem(getTeamPlanKey(teamId, oldName));
      }
    }
  };

  const handleDuplicate = (plan: string) => {
    if (teamPlans) {
      const nextIndex = teamPlans.length;
      const name = getDefaultName(teamPlans);
      setTeamPlans([...teamPlans, name]);
      setLocalStorageItem(
        getTeamPlanKey(teamId, name),
        getLocalStorageItem(getTeamPlanKey(teamId, plan), [])
      );
      setTabIndex(nextIndex);
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
        setTabIndex(nextTransferPlans.length - 1);
      }

      removeLocalStorageItem(getTeamPlanKey(teamId, plan));
    }
  };

  const handleTransferPlansChange = (newOrder: ItemInterface[]) => {
    const nextTransferPlans = newOrder.map((i) => `${i.id}`);
    setTeamPlans(nextTransferPlans);
    setTabIndex(
      nextTransferPlans.findIndex((t) => t === teamPlans?.[tabIndex])
    );
  };

  return (
    <>
      <CustomPlayersModal
        players={players}
        fplTeams={fplTeams}
        isOpen={isOpen}
        onClose={onClose}
      />
      <Box height="100%" overflow="hidden" {...props}>
        <Tabs
          variant="enclosed-colored"
          height="100%"
          display="flex"
          flexDirection="column"
          index={tabIndex}
          onChange={handleTabsChange}
        >
          <Flex bg="gray.50">
            <ReactSortable
              // NOTE: react-sortablejs typescript is not well-defined so just ignore it
              // @ts-ignore
              tag={ForwardableTransferPlannerTabList}
              list={sortableTransferPlans}
              setList={handleTransferPlansChange}
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
            <Flex flexGrow={1} justifyContent="space-between">
              <IconButton
                width="60px"
                height="100%"
                variant="ghost"
                borderRadius="none"
                icon={<Icon as={IoAdd} />}
                aria-label="add a new plan"
                onClick={handleAddNewTransferPlan}
              />
              <Flex>
                <Divider orientation="vertical" />
                <Box p="2px">
                  <Button
                    size="sm"
                    height="100%"
                    variant="ghost"
                    borderRadius="none"
                    leftIcon={<Icon as={IoSettingsOutline} />}
                    onClick={onOpen}
                  >
                    Custom Players
                  </Button>
                </Box>
              </Flex>
            </Flex>
          </Flex>
          <TabPanels display="flex" flexGrow={1} flexDirection="column">
            {teamPlans?.map((plan) => (
              <TabPanel
                key={plan}
                p={0}
                flexGrow={1}
                display="flex"
                flexDirection="column"
                borderTopWidth={1}
              >
                {teamId && (
                  <TeamPlannerPanel
                    teamId={teamId}
                    transferPlanKey={plan}
                    initialPicks={initialPicks}
                    entryHistory={entryHistory}
                    players={players}
                    gameweeks={gameweeks}
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
