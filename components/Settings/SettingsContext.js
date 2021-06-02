import { useDisclosure } from "@chakra-ui/hooks";
import { createContext, useContext } from "react";
import SettingsModal from "~/components/Settings/SettingsModal";
import useLocalStorage from "~/libs/useLocalStorage";
import { getTeamIdKey, getTransferPlannerPinnedBenchKey } from "./storage";

const SettingsContext = createContext({
  isInitialised: false,
  teamId: null,
  setTeamId: () => {},
  transferPlannerPinnedBench: true,
  setTransferPlannerPinnedBench: () => {},
  isSettingsModalOpen: false,
  onSettingsModalOpen: () => {},
  onSettingsModalClsoe: () => {},
});

export const SettingsContextProvider = ({ children, ...props }) => {
  const [teamId, setTeamId, isInitialised] = useLocalStorage(
    getTeamIdKey(),
    null
  );
  const [transferPlannerPinnedBench, setTransferPlannerPinnedBench] =
    useLocalStorage(getTransferPlannerPinnedBenchKey(), true);
  const { isOpen, onOpen, onClose } = useDisclosure();
  return (
    <SettingsContext.Provider
      value={{
        isInitialised,
        teamId,
        setTeamId,
        transferPlannerPinnedBench,
        setTransferPlannerPinnedBench,
        isSettingsModelOpen: isOpen,
        onSettingsModalOpen: onOpen,
        onSettingsModalClsoe: onClose,
      }}
      {...props}
    >
      <SettingsModal isOpen={isOpen} onClose={onClose} />
      {children}
    </SettingsContext.Provider>
  );
};

export const useSettings = () => useContext(SettingsContext);
