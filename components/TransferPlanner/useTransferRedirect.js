import { useRouter } from "next/router";
import { useEffect } from "react";
import { useSettings } from "~/components/Settings/SettingsContext";

const useTransferRedirect = () => {
  const { teamId, isInitialised } = useSettings();
  const router = useRouter();

  useEffect(() => {
    if (isInitialised) {
      let redirectPath;
      if (teamId) {
        redirectPath = `/transfers/${teamId}`;
      } else {
        redirectPath = "/transfers";
      }
      if (router.route !== redirectPath) {
        router.push(redirectPath);
      }
    }
  }, [teamId]);

  return { teamId, isInitialised };
};

export default useTransferRedirect;
