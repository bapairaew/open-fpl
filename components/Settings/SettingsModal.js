import {
  Box,
  Drawer,
  DrawerBody,
  DrawerCloseButton,
  DrawerContent,
  DrawerHeader,
  DrawerOverlay,
  useToast,
} from "@chakra-ui/react";
import AddProfile from "~/components/Settings/AddProfile";
import { useSettings } from "~/components/Settings/SettingsContext";
import SettingsProfilesList from "~/components/Settings/SettingsProfilesList";
import { getSettingsKey, getTransferPlanKey } from "./storage";

const SettingsModal = ({ isOpen, onClose }) => {
  const toast = useToast();
  const { teamId, setTeamId, profiles, setProfiles } = useSettings();

  const handleAddProfile = (teamId) => {
    if (!profiles.includes(teamId)) {
      setProfiles([...profiles, teamId]);
      setTeamId(teamId);
      toast({
        title: "Profile created.",
        description: `${teamId} profile has been successfully created.`,
        status: "success",
        duration: 5000,
        isClosable: true,
      });
    } else {
      setTeamId(teamId);
      toast({
        title: "Profile existed.",
        description: `${teamId} profile is already existed so we reactivated this profile for you.`,
        status: "success",
        duration: 5000,
        isClosable: true,
      });
    }
  };

  const handleActiveProfileChange = (teamId) => {
    setTeamId(teamId);
  };

  const handleRemoveProfile = (removingTeamId) => {
    setProfiles(profiles.filter((p) => p !== removingTeamId));
    window.localStorage.removeItem(getSettingsKey(removingTeamId));
    window.localStorage.removeItem(getTransferPlanKey(removingTeamId));
    if (teamId === removingTeamId) {
      setTeamId(null);
    }
    toast({
      title: "Profile removed.",
      description: `${teamId} is removed successfully.`,
      status: "success",
      duration: 5000,
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
