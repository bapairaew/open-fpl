import {
  Box,
  BoxProps,
  Icon,
  IconButton,
  TabList,
  TabPanel,
  TabPanels,
  Tabs,
} from "@chakra-ui/react";
import { useEffect, useState } from "react";
import { IoAdd } from "react-icons/io5";
import { Gameweek, Player } from "~/features/AppData/appDataTypes";
import {
  EntryChipPlay,
  EntryEventHistory,
  EntryEventPick,
  Transfer,
} from "~/features/AppData/fplTypes";
import { useSettings } from "~/features/Settings/SettingsContext";
import TransferPlannerPanel from "~/features/TransferPlanner/TransferPlannerPanel";
import TransferPlannerTab from "~/features/TransferPlanner/TransferPlannerTab";
import {
  getLocalStorageItem,
  removeLocalStorageItem,
  setLocalStorageItem,
} from "~/features/Common/useLocalStorage";
import { getTransferPlanKey } from "~/features/Settings/storageKeys";

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

const TransferPlanner = ({
  initialPicks,
  entryHistory,
  players,
  gameweeks,
  transfers,
  chips,
  ...props
}: BoxProps & {
  initialPicks: EntryEventPick[] | null;
  entryHistory: EntryEventHistory | null;
  players: Player[];
  gameweeks: Gameweek[];
  transfers: Transfer[];
  chips: EntryChipPlay[];
}) => {
  const { teamId, transferPlans, setTransferPlans } = useSettings();
  const [tabIndex, setTabIndex] = useState(0);

  useEffect(() => {
    setTabIndex(0);
  }, [teamId]);

  const handleTabsChange = (index: number) => {
    setTabIndex(index);
  };

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
        const data = getLocalStorageItem(
          getTransferPlanKey(teamId, oldName),
          []
        );
        setLocalStorageItem(getTransferPlanKey(teamId, newName), data);
      }
    }
  };

  const handleDuplicate = (plan: string) => {
    if (transferPlans) {
      const nextIndex = transferPlans.length;
      const name = getDefaultName(transferPlans);
      setTransferPlans([...transferPlans, name]);
      setLocalStorageItem(
        getTransferPlanKey(teamId, name),
        getLocalStorageItem(getTransferPlanKey(teamId, plan), [])
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

      removeLocalStorageItem(getTransferPlanKey(teamId, plan));
    }
  };

  return (
    <Box height="100%" overflow="hidden" {...props}>
      <Tabs
        variant="enclosed-colored"
        height="100%"
        display="flex"
        flexDirection="column"
        index={tabIndex}
        onChange={handleTabsChange}
      >
        <TabList pl={2} bg="gray.50">
          {transferPlans?.map((plan) => (
            <TransferPlannerTab
              key={plan}
              plan={plan}
              onNameChange={(newName: string) => handleRename(newName, plan)}
              onRemoveClick={() => handleRemove(plan)}
              onDuplicateClick={() => handleDuplicate(plan)}
            />
          ))}
          <IconButton
            width="60px"
            height="100%"
            variant="ghost"
            borderRadius="none"
            icon={<Icon as={IoAdd} />}
            aria-label="add a new plan"
            onClick={handleAddNewTransferPlan}
          />
        </TabList>
        <TabPanels display="flex" flexGrow={1} flexDirection="column">
          {transferPlans?.map((plan) => (
            <TabPanel
              key={plan}
              p={0}
              flexGrow={1}
              display="flex"
              flexDirection="column"
            >
              {teamId && (
                <TransferPlannerPanel
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
  );
};

export default TransferPlanner;
