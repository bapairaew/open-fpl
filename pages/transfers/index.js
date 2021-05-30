import { Button, Heading, VStack } from "@chakra-ui/react";
import { NextSeo } from "next-seo";
import useTransferRedirect from "~/components/TransferPlanner/useTransferRedirect";
import { useUser } from "~/components/User/UserContext";

const TransferPlannerSetupPage = () => {
  useTransferRedirect();
  const { onUserModalOpen } = useUser();

  return (
    <>
      <NextSeo title="Transfer Planner | Open FPL" />
      <VStack
        justifyContent="center"
        alignItems="center"
        height="100%"
        spacing={6}
      >
        <Heading size="lg" fontWeight="black">
          Set up your Team ID to access Transfer Planner
        </Heading>
        <Button size="md" onClick={onUserModalOpen}>
          Set up your team
        </Button>
      </VStack>
    </>
  );
};

export default TransferPlannerSetupPage;
