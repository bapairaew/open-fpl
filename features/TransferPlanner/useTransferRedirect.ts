import { useRouter } from "next/router";
import { useEffect } from "react";
import { useSettings } from "~/features/Settings/SettingsContext";

const useTransferRedirect = () => {
  const { teamId, isInitialised } = useSettings();
  const router = useRouter();

  useEffect(() => {
    if (isInitialised) {
      let redirectPath: string;
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
