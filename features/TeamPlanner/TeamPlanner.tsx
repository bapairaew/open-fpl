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
import { Gameweek } from "~/features/AppData/appDataTypes";
import {
  getLocalStorageItem,
  removeLocalStorageItem,
  setLocalStorageItem,
} from "~/features/Common/useLocalStorage";
import CustomPlayersModal from "~/features/CustomPlayer/CustomPlayersModal";
import { hydrateClientData } from "~/features/PlayerData/playerData";
import { Player } from "~/features/PlayerData/playerDataTypes";
import {
  EntryChipPlay,
  EntryEventHistory,
  EntryEventPick,
  Team,
  Transfer,
} from "~/features/RemoteData/fplTypes";
import { useSettings } from "~/features/Settings/SettingsContext";
import { getTeamPlanKey } from "~/features/Settings/storageKeys";
import TeamPlannerPanel from "~/features/TeamPlanner/TeamPlannerPanel";
import TeamPlannerTab from "~/features/TeamPlanner/TeamPlannerTab";

const getDefaultName = (transferPlans: string[]) => {
  const maxDefaultNameIndex =
    Math.max(
      0,
      ...transferPlans
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
  const {
    teamId,
    transferPlans,
    starredPlayers,
    setTransferPlans,
    customPlayers,
  } = useSettings();
  const [tabIndex, setTabIndex] = useState(0);
  const sortableTransferPlans = useMemo<ItemInterface[]>(
    () => transferPlans?.map((id) => ({ id })) ?? [],
    [transferPlans]
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
    if (transferPlans) {
      const nextIndex = transferPlans.length;
      setTransferPlans([...transferPlans, getDefaultName(transferPlans)]);
      setTabIndex(nextIndex);
    }
  };

  const handleRename = (newName: string, oldName: string) => {
    if (transferPlans && newName !== oldName) {
      const nextTransferPlans = [...transferPlans];
      const index = nextTransferPlans.findIndex((p) => p === oldName);
      if (index !== -1) {
        nextTransferPlans[index] = newName;
        setTransferPlans(nextTransferPlans);
        const data = getLocalStorageItem(getTeamPlanKey(teamId, oldName), []);
        setLocalStorageItem(getTeamPlanKey(teamId, newName), data);
        removeLocalStorageItem(getTeamPlanKey(teamId, oldName));
      }
    }
  };

  const handleDuplicate = (plan: string) => {
    if (transferPlans) {
      const nextIndex = transferPlans.length;
      const name = getDefaultName(transferPlans);
      setTransferPlans([...transferPlans, name]);
      setLocalStorageItem(
        getTeamPlanKey(teamId, name),
        getLocalStorageItem(getTeamPlanKey(teamId, plan), [])
      );
      setTabIndex(nextIndex);
    }
  };

  const handleRemove = (plan: string) => {
    if (transferPlans) {
      const nextTransferPlans = transferPlans?.filter((p) => p !== plan);

      if (nextTransferPlans.length === 0) {
        setTransferPlans([getDefaultName(nextTransferPlans)]);
        setTabIndex(0);
      } else {
        setTransferPlans(nextTransferPlans);
        setTabIndex(nextTransferPlans.length - 1);
      }

      removeLocalStorageItem(getTeamPlanKey(teamId, plan));
    }
  };

  const handleTransferPlansChange = (newOrder: ItemInterface[]) => {
    const nextTransferPlans = newOrder.map((i) => `${i.id}`);
    setTransferPlans(nextTransferPlans);
    setTabIndex(
      nextTransferPlans.findIndex((t) => t === transferPlans?.[tabIndex])
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
            {transferPlans?.map((plan) => (
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
