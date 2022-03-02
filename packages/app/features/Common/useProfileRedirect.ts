import { useSettings } from "@open-fpl/app/features/Settings/Settings";
import { useRouter } from "next/router";
import { useEffect } from "react";

const useProfileRedirect = (path: string) => {
  const { profile, isInitialised } = useSettings();
  const router = useRouter();

  useEffect(() => {
    if (isInitialised) {
      let redirectPath: string;
      if (profile) {
        redirectPath = `${path}/${profile}`;
      } else {
        redirectPath = `${path}`;
      }
      if (router.route !== redirectPath) {
        router.push(redirectPath);
      }
    }
  }, [profile, isInitialised]);

  return { profile, isInitialised };
};

export default useProfileRedirect;
