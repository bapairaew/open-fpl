import { useRouter } from "next/router";
import { useEffect } from "react";
import { useUser } from "~/components/User/UserContext";

const useTransferRedirect = () => {
  const { teamId, isInitialised } = useUser();
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
