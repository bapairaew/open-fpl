import { Button, Heading, Link as A, VStack } from "@chakra-ui/react";
import { NextSeo } from "next-seo";
import Link from "next/link";
import { useSettings } from "~/components/Settings/SettingsContext";
import useTransferRedirect from "~/components/TransferPlanner/useTransferRedirect";

const TransferPlannerSetupPage = () => {
  const { teamId } = useTransferRedirect();
  const { onSettingsModalOpen } = useSettings();

  return (
    <>
      <NextSeo
        title="Transfer Planner | Open FPL"
        description="Plan your transfer, starting lineup and your bench ahead of upcoming Fantasy Premier League gameweeks."
      />
      <VStack
        justifyContent="center"
        alignItems="center"
        height="100%"
        spacing={6}
      >
        {teamId ? (
          <>
            <Heading size="lg" fontWeight="black">
              Please wait while you are being redirected to Transfer Planner
            </Heading>
            <Link href={`/transfers/${teamId}`} passHref>
              <A>
                <Button size="md" onClick={onSettingsModalOpen} variant="link">
                  Click here if it does not work
                </Button>
              </A>
            </Link>
          </>
        ) : (
          <>
            <Heading size="lg" fontWeight="black">
              Set up a profile with your Team ID to access Transfer Planner
            </Heading>
            <Button size="md" onClick={onSettingsModalOpen}>
              Set up your profile
            </Button>
          </>
        )}
      </VStack>
    </>
  );
};

export default TransferPlannerSetupPage;
