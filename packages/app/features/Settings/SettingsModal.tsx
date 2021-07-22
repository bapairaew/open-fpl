import {
  Box,
  Drawer,
  DrawerBody,
  DrawerCloseButton,
  DrawerContent,
  DrawerHeader,
  DrawerOverlay,
  Link as A,
  useToast,
} from "@chakra-ui/react";
import { TeamApiResponse } from "@open-fpl/app/features/Api/apiTypes";
import {
  getLocalStorageItem,
  removeLocalStorageItem,
  setLocalStorageItem,
} from "@open-fpl/app/features/Common/useLocalStorage";
import AddProfile from "@open-fpl/app/features/Settings/AddProfile";
import { useSettings } from "@open-fpl/app/features/Settings/SettingsContext";
import SettingsProfilesList from "@open-fpl/app/features/Settings/SettingsProfilesList";
import { Preference } from "@open-fpl/app/features/Settings/settingsTypes";
import {
  getPreferenceKey,
  getTeamPlanKey,
  getTeamPlansKey,
} from "@open-fpl/app/features/Settings/storageKeys";
import { useRef } from "react";

const SettingsModal = ({
  isOpen,
  onClose,
}: {
  isOpen: boolean;
  onClose: () => void;
}) => {
  const toast = useToast();
  const { teamId, setTeamId, profiles, setProfiles } = useSettings();
  const initialFocusRef = useRef<HTMLInputElement | HTMLButtonElement | null>(
    null
  );

  const handleAddProfile = async (teamId: string) => {
    if (profiles && !profiles.includes(teamId)) {
      const { data: { name } = {}, error } = (await (
        await fetch(`/api/team/${teamId}`)
      ).json()) as TeamApiResponse;

      if (error) {
        toast({
          title: `Unable to create ${teamId}.`,
          description: (
            <>
              There is something wrong while fetching data from FPL. Maybe your
              id is not correct?{" "}
              <A href="/help/id" textDecoration="underline">
                Check this guide to find you ID.
              </A>
            </>
          ),
          status: "error",
          isClosable: true,
        });
      } else {
        setLocalStorageItem(getPreferenceKey(teamId), {
          ...getLocalStorageItem(getPreferenceKey(teamId), {}),
          name,
        });
        setProfiles([...profiles, teamId]);
        setTeamId(teamId);
        toast({
          title: "Profile created.",
          description: `${
            name ?? teamId
          } profile has been successfully created.`,
          status: "success",
          isClosable: true,
        });
      }
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
    const { name, teamPlans } =
      getLocalStorageItem<Preference>(getPreferenceKey(removingTeamId), {}) ||
      {};
    setProfiles(profiles ? profiles.filter((p) => p !== removingTeamId) : []);
    removeLocalStorageItem(getPreferenceKey(removingTeamId));
    teamPlans?.forEach((id) =>
      removeLocalStorageItem(getTeamPlanKey(removingTeamId, id))
    );
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
      size="md"
      placement="right"
      isOpen={isOpen}
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
