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
import { useRef } from "react";
import AddProfile from "~/features/Settings/AddProfile";
import { useSettings } from "~/features/Settings/SettingsContext";
import SettingsProfilesList from "~/features/Settings/SettingsProfilesList";
import {
  getPreferenceKey,
  getTransferPlanKey,
} from "~/features/Settings/storageKeys";
import {
  getLocalStorageItem,
  removeLocalStorageItem,
  setLocalStorageItem,
} from "~/features/Common/useLocalStorage";
import { Preference } from "~/features/Settings/settingsTypes";
import { TeamApiResponse } from "~/features/Api/apiTypes";

const SettingsModal = ({
  isOpen,
  onClose,
}: {
  isOpen: boolean;
  onClose: () => void;
}) => {
  const toast = useToast();
  const { teamId, setTeamId, profiles, setProfiles } = useSettings();
  const initialFocusRef =
    useRef<HTMLInputElement | HTMLButtonElement | null>(null);

  const handleAddProfile = async (teamId: string) => {
    if (profiles && !profiles.includes(teamId)) {
      const {
        data: { name } = {},
        // Ignore error case
        //error
      } = (await (
        await fetch(`/api/team/${teamId}`)
      ).json()) as TeamApiResponse;

      setLocalStorageItem(getPreferenceKey(teamId), {
        ...getLocalStorageItem(getPreferenceKey(teamId), {
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
      const { name } =
        getLocalStorageItem<Preference>(getPreferenceKey(teamId), {}) || {};
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

  const handleActiveProfileChange = (teamId: string) => {
    setTeamId(teamId);
  };

  const handleRemoveProfile = (removingTeamId: string) => {
    const { name } =
      getLocalStorageItem<Preference>(getPreferenceKey(removingTeamId), {}) ||
      {};
    setProfiles(profiles ? profiles.filter((p) => p !== removingTeamId) : []);
    removeLocalStorageItem(getPreferenceKey(removingTeamId));
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
    <Drawer
      isOpen={isOpen}
      placement="right"
      onClose={onClose}
      initialFocusRef={initialFocusRef}
    >
      <DrawerOverlay />
      <DrawerContent>
        <DrawerCloseButton />
        <DrawerHeader fontWeight="black">Profiles</DrawerHeader>
        <DrawerBody>
          <AddProfile
            initialFocusRef={initialFocusRef}
            hasExistedProfile={profiles ? profiles.length > 0 : false}
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
