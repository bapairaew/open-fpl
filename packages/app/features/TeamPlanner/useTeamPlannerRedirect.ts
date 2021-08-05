import { useRouter } from "next/router";
import { useEffect } from "react";
import { useSettings } from "@open-fpl/app/features/Settings/Settings";

const useTeamPlannerRedirect = () => {
  const { profile, isInitialised } = useSettings();
  const router = useRouter();

  useEffect(() => {
    if (isInitialised) {
      let redirectPath: string;
      if (profile) {
        redirectPath = `/teams/${profile}`;
      } else {
        redirectPath = "/teams";
      }
      if (router.route !== redirectPath) {
        router.push(redirectPath);
      }
    }
  }, [profile, isInitialised]);

  return { profile, isInitialised };
};

export default useTeamPlannerRedirect;
