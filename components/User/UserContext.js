import { useDisclosure } from "@chakra-ui/hooks";
import useLocalStorage from "~/libs/useLocalStorage";
import { createContext, useContext } from "react";
import UserModal from "~/components/User/UserModal";

const UserContext = createContext({
  teamId: null,
  setTeamId: () => {},
  transferPlannerPinnedBench: true,
  setTransferPlannerPinnedBench: () => {},
  isUserModalOpen: false,
  onUserModalOpen: () => {},
  onUserModalClsoe: () => {},
});

export const UserContextProvider = ({ children, ...props }) => {
  const [teamId, setTeamId] = useLocalStorage("teamId", null);
  const [transferPlannerPinnedBench, setTransferPlannerPinnedBench] =
    useLocalStorage("transferPlannerPinnedBench", true);
  const { isOpen, onOpen, onClose } = useDisclosure();
  return (
    <UserContext.Provider
      value={{
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
