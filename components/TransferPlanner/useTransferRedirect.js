import { useRouter } from "next/router";
import { useEffect } from "react";
import { useSettings } from "~/components/Settings/SettingsContext";

const useTransferRedirect = () => {
  const { teamId, isInitialised } = useSettings();
  const router = useRouter();

  useEffect(() => {
    if (isInitialised) {
      if (teamId) {
        router.push(`/transfers/${teamId}`);
      } else {
        router.push(`/transfers`);
      }
    }
  }, [teamId]);

  return { teamId, isInitialised };
};

export default useTransferRedirect;
