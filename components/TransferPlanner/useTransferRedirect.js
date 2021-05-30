import { useRouter } from "next/router";
import { useEffect } from "react";
import { useUser } from "~/components/User/UserContext";

const useTransferRedirect = () => {
  const { teamId } = useUser();
  const router = useRouter();

  useEffect(() => {
    if (teamId) {
      router.push(`/transfers/${teamId}`);
    } else {
      router.push(`/transfers`);
    }
  }, [teamId]);
};

export default useTransferRedirect;
