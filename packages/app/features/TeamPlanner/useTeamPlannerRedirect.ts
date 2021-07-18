import { useRouter } from "next/router";
import { useEffect } from "react";
import { useSettings } from "@open-fpl/app/features/Settings/SettingsContext";

const useTeamPlannerRedirect = () => {
  const { teamId, isInitialised } = useSettings();
  const router = useRouter();

  useEffect(() => {
    if (isInitialised) {
      let redirectPath: string;
      if (teamId) {
        redirectPath = `/teams/${teamId}`;
      } else {
        redirectPath = "/teams";
      }
      if (router.route !== redirectPath) {
        router.push(redirectPath);
      }
    }
  }, [teamId]);

  return { teamId, isInitialised };
};

export default useTeamPlannerRedirect;
