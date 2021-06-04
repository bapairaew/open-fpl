import {
  Box,
  Drawer,
  DrawerBody,
  DrawerCloseButton,
  DrawerContent,
  DrawerHeader,
  DrawerOverlay,
  useToast
} from "@chakra-ui/react";
import AddProfile from "~/components/Settings/AddProfile";
import { useSettings } from "~/components/Settings/SettingsContext";
import SettingsProfilesList from "~/components/Settings/SettingsProfilesList";
import {
  getLocalStorageItem,
  removeLocalStorageItem,
  setLocalStorageItem
} from "~/libs/useLocalStorage";
import { getSettingsKey, getTransferPlanKey } from "./storage";

const SettingsModal = ({ isOpen, onClose }) => {
  const toast = useToast();
  const { teamId, setTeamId, profiles, setProfiles } = useSettings();

  const handleAddProfile = async (teamId) => {
    if (!profiles.includes(teamId)) {
      const { name } = await (await fetch(`/api/team/${teamId}`)).json();
      setLocalStorageItem(getSettingsKey(teamId), {
        ...getLocalStorageItem(getSettingsKey(teamId), {
          transferPlannerPinnedBench: false,
        }),
        name,
      });
      setProfiles([...profiles, teamId]);
      setTeamId(teamId);
      toast({
        title: "Profile created.",
        description: `${name ?? teamId} profile has been successfully created.`,
        status: "success",
        isClosable: true,
      });
    } else {
      setTeamId(teamId);
      const { name } = getLocalStorageItem(getSettingsKey(teamId), {});
      toast({
        title: "Profile existed.",
        description: `${
          name ?? teamId
        } profile is already existed so we reactivated this profile for you.`,
        status: "success",
        isClosable: true,
      });
    }
  };

  const handleActiveProfileChange = (teamId) => {
    setTeamId(teamId);
  };

  const handleRemoveProfile = (removingTeamId) => {
    const { name } = getLocalStorageItem(getSettingsKey(removingTeamId), {});
    setProfiles(profiles.filter((p) => p !== removingTeamId));
    removeLocalStorageItem(getSettingsKey(removingTeamId));
    removeLocalStorageItem(getTransferPlanKey(removingTeamId));
    if (teamId === removingTeamId) {
      setTeamId(null);
    }
    toast({
      title: "Profile removed.",
      description: `${name ?? removingTeamId} is removed successfully.`,
      status: "success",
      isClosable: true,
    });
  };

  return (
    <Drawer isOpen={isOpen} placement="right" onClose={onClose}>
      <DrawerOverlay />
      <DrawerContent>
        <DrawerCloseButton />
        <DrawerHeader fontWeight="black">Profiles</DrawerHeader>
        <DrawerBody>
          <AddProfile
            hasExistedProfile={profiles?.length > 0}
            onAddProfile={handleAddProfile}
          />
          <Box my={4}>
            <SettingsProfilesList
              activeProfile={teamId}
              profiles={profiles}
              onActiveProfileChange={handleActiveProfileChange}
              onRemoveProfile={handleRemoveProfile}
            />
          </Box>
        </DrawerBody>
      </DrawerContent>
    </Drawer>
  );
};

export default SettingsModal;
