import { createStandaloneToast, Link } from "@chakra-ui/react";
import externalLinks from "@open-fpl/app/../common/features/Navigation/externalLinks";
import { AnalyticsMigration } from "@open-fpl/app/features/Analytics/analyticsTypes";
import {
  getLocalStorageItem,
  setLocalStorageItem,
  setLocalStorageItemFromString,
} from "@open-fpl/app/features/Common/useLocalStorage";
import { Preference } from "@open-fpl/app/features/Settings/settingsTypes";
import {
  getActiveProfileKey,
  getCustomPlayersKey,
  getFixturesTeamsOrderKey,
  getIsAppDomainMigratedKey,
  getPlayersExplorerDisplayOptionKey,
  getPlayersExplorerSortOptionKey,
  getPlayersExplorerTableSortColumnsKey,
  getPreferenceKey,
  getStarredPlayersKey,
  getTeamPlanKey,
  getTeamPlannerPinnedBenchKey,
  getTeamPlansKey,
  getTeamsStrengthKey,
} from "@open-fpl/app/features/Settings/storageKeys";
// @ts-ignore
import { CrossStorageClient } from "cross-storage";
import { usePlausible } from "next-plausible";

const { NEXT_PUBLIC_CROSS_DOMAIN_HUB_URL: hubUrl } = process.env;

const toast = createStandaloneToast();

export const migrateFromWWWDomain = async () => {
  let notificationToast: string | number | undefined;
  let hubConnected = false;
  const plausible = usePlausible<AnalyticsMigration>();
  try {
    const isMigrated = getLocalStorageItem<boolean>(
      getIsAppDomainMigratedKey()
    );

    if (!isMigrated) {
      const storage = new CrossStorageClient(
        `${hubUrl}/cross-storage-hub.html`,
        {
          timeout: 10 * 1000,
        }
      );

      await storage.onConnect();
      hubConnected = true;

      const profilesString: string = await storage.get("profiles");
      const profiles = profilesString
        ? (JSON.parse(profilesString) as string[])
        : null;

      if (profiles) {
        plausible("migration-start");
        notificationToast = toast({
          title: "Migrating to new version.",
          description:
            "Your data is being migrated to the new version. Please leave your browser open until this notification disappeared.",
          status: "info",
          duration: null,
          isClosable: false,
        });

        for (const profile of profiles) {
          const preferenceString = await storage.get(getPreferenceKey(profile));
          const preference: Preference = JSON.parse(preferenceString);

          const oldTeamPlansString = await storage.get(
            getTeamPlansKey(profile)
          );
          const oldTeamPlans: string[] = JSON.parse(oldTeamPlansString);

          for (const teamPlan of preference.teamPlans ?? oldTeamPlans ?? []) {
            setLocalStorageItemFromString(
              getTeamPlanKey(profile, teamPlan),
              await storage.get(getTeamPlanKey(profile, teamPlan))
            );
          }

          setLocalStorageItemFromString(
            getPreferenceKey(profile),
            preferenceString
          );

          setLocalStorageItemFromString(
            getTeamPlansKey(profile),
            oldTeamPlansString
          );

          setLocalStorageItemFromString(
            getStarredPlayersKey(profile),
            await storage.get(getStarredPlayersKey(profile))
          );

          setLocalStorageItemFromString(
            getActiveProfileKey(),
            await storage.get(getActiveProfileKey())
          );
          setLocalStorageItemFromString(
            getFixturesTeamsOrderKey(),
            await storage.get(getFixturesTeamsOrderKey())
          );
          setLocalStorageItemFromString(
            getCustomPlayersKey(),
            await storage.get(getCustomPlayersKey())
          );
          setLocalStorageItemFromString(
            getTeamsStrengthKey(),
            await storage.get(getTeamsStrengthKey())
          );
          setLocalStorageItemFromString(
            getTeamPlannerPinnedBenchKey(),
            await storage.get(getTeamPlannerPinnedBenchKey())
          );
          setLocalStorageItemFromString(
            getPlayersExplorerDisplayOptionKey(),
            await storage.get(getPlayersExplorerDisplayOptionKey())
          );
          setLocalStorageItemFromString(
            getPlayersExplorerSortOptionKey(),
            await storage.get(getPlayersExplorerSortOptionKey())
          );
          setLocalStorageItemFromString(
            getPlayersExplorerTableSortColumnsKey(),
            await storage.get(getPlayersExplorerTableSortColumnsKey())
          );
        }

        toast({
          title: "All done!",
          description: (
            <>
              Your data is successfully migrated to the new version! Please wait
              while this page is being reloaded to apply the changes.
            </>
          ),
          status: "success",
          duration: 3000,
          isClosable: true,
        });

        setTimeout(() => {
          window.location.reload();
        }, 1000);
      }

      setLocalStorageItem<boolean>(getIsAppDomainMigratedKey(), true);
      plausible("migration-done");
    }
  } catch (e) {
    if (hubConnected) {
      toast({
        title: "Something went wrong.",
        description: (
          <>
            There is something wrong while migrating your data. Please contract{" "}
            <Link href={externalLinks.twitter} isExternal>
              @openfpl
            </Link>{" "}
            for help.
          </>
        ),
        status: "error",
        duration: 3000,
        isClosable: true,
      });
    }
    plausible("migration-fail");
  } finally {
    if (notificationToast !== undefined) {
      toast.close(notificationToast);
    }
  }
};
