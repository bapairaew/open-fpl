import { useDisclosure } from "@chakra-ui/hooks";
import { createContext, useContext } from "react";
import UserModal from "~/components/User/UserModal";
import useLocalStorage from "~/libs/useLocalStorage";
import { getTransferPlannerPinnedBenchKey, getTeamIdKey } from "./storage";

const UserContext = createContext({
  isInitialised: false,
  teamId: null,
  setTeamId: () => {},
  transferPlannerPinnedBench: true,
  setTransferPlannerPinnedBench: () => {},
  isUserModalOpen: false,
  onUserModalOpen: () => {},
  onUserModalClsoe: () => {},
});

export const UserContextProvider = ({ children, ...props }) => {
  const [teamId, setTeamId, isInitialised] = useLocalStorage(
    getTeamIdKey(),
    null
  );
  const [transferPlannerPinnedBench, setTransferPlannerPinnedBench] =
    useLocalStorage(getTransferPlannerPinnedBenchKey(), true);
  const { isOpen, onOpen, onClose } = useDisclosure();
  return (
    <UserContext.Provider
      value={{
        isInitialised,
        teamId,
        setTeamId,
        transferPlannerPinnedBench,
        setTransferPlannerPinnedBench,
        isUserModelOpen: isOpen,
        onUserModalOpen: onOpen,
        onUserModalClsoe: onClose,
      }}
      {...props}
    >
      <UserModal isOpen={isOpen} onClose={onClose} />
      {children}
    </UserContext.Provider>
  );
};

export const useUser = () => useContext(UserContext);
