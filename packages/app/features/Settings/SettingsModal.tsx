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
import { AnalyticsSettings } from "@open-fpl/app/features/Analytics/analyticsTypes";
import { TeamApiResponse } from "@open-fpl/app/features/Api/apiTypes";
import {
  getLocalStorageItem,
  removeLocalStorageItem,
  setLocalStorageItem,
} from "@open-fpl/app/features/Common/useLocalStorage";
import AddProfile from "@open-fpl/app/features/Settings/AddProfile";
import { useSettings } from "@open-fpl/app/features/Settings/Settings";
import SettingsProfilesList from "@open-fpl/app/features/Settings/SettingsProfilesList";
import { Preference } from "@open-fpl/app/features/Settings/settingsTypes";
import {
  getPreferenceKey,
  getTeamPlanKey,
} from "@open-fpl/app/features/Settings/storageKeys";
import { usePlausible } from "next-plausible";
import { useRef } from "react";

const SettingsModal = ({
  isOpen,
  onClose,
}: {
  isOpen: boolean;
  onClose: () => void;
}) => {
  const plausible = usePlausible<AnalyticsSettings>();
  const toast = useToast();
  const { profile, setProfile, profiles, setProfiles } = useSettings();
  const initialFocusRef = useRef<HTMLInputElement | HTMLButtonElement | null>(
    null
  );

  const handleAddProfile = async (profile: string) => {
    if (!profiles || !profiles.includes(profile)) {
      const { data: { name } = {}, error } = (await (
        await fetch(`/api/entries/${profile}`)
      ).json()) as TeamApiResponse;

      if (error) {
        toast({
          title: `Unable to create ${profile}.`,
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
        setLocalStorageItem(getPreferenceKey(profile), {
          ...getLocalStorageItem(getPreferenceKey(profile), {}),
          name,
        });
        setProfiles([...(profiles ?? []), profile]);
        setProfile(profile);
        toast({
          title: "Profile created.",
          description: `${
            name ?? profile
          } profile has been successfully created.`,
          status: "success",
          isClosable: true,
        });
        plausible("settings-profile-add");
      }
    } else {
      setProfile(profile);
      const { name } =
        getLocalStorageItem<Preference>(getPreferenceKey(profile), {}) || {};
      toast({
        title: "Profile existed.",
        description: `${
          name ?? profile
        } profile is already existed so we reactivated this profile for you.`,
        status: "success",
        isClosable: true,
      });
    }
  };

  const handleActiveProfileChange = (profile: string) => {
    setProfile(profile);
    plausible("settings-profile-select");
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
    if (profile === removingTeamId) {
      setProfile(null);
    }
    toast({
      title: "Profile removed.",
      description: `${name ?? removingTeamId} is removed successfully.`,
      status: "success",
      isClosable: true,
    });
    plausible("settings-profile-remove");
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
              activeProfile={profile}
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
