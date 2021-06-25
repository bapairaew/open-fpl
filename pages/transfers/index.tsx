import { Button, Spinner, Link as A, VStack, Text } from "@chakra-ui/react";
import { NextSeo } from "next-seo";
import Link from "next/link";
import FullScreenMessage from "~/features/Layout/FullScreenMessage";
import { useSettings } from "~/features/Settings/SettingsContext";
import useTransferRedirect from "~/features/TransferPlanner/useTransferRedirect";

const TransferPlannerSetupPage = () => {
  const { teamId } = useTransferRedirect();
  const { onSettingsModalOpen } = useSettings();

  return (
    <>
      <NextSeo
        title="Transfer Planner | Open FPL"
        description="Plan your transfer, starting lineup and your bench ahead of upcoming Fantasy Premier League gameweeks."
      />
      {teamId ? (
        <FullScreenMessage
          symbol={<Spinner size="xl" />}
          heading="Almost there..."
          text={
            <VStack spacing={6}>
              <Text>
                Please wait while we are bringing you to your Transfer Planner
                page.
              </Text>
              <Link href={`/transfers/${teamId}`} passHref>
                <A>
                  <Button
                    size="md"
                    onClick={onSettingsModalOpen}
                    variant="link"
                  >
                    Click here if it does not work
                  </Button>
                </A>
              </Link>
            </VStack>
          }
        />
      ) : (
        <FullScreenMessage
          symbol="((((つ•̀ω•́)つ"
          heading="Set up a profile to get started"
          text={
            <VStack spacing={6}>
              <Text>
                Set up a profile with your Team ID to access Transfer Planner
              </Text>
              <Button size="md" onClick={onSettingsModalOpen}>
                Set up your profile
              </Button>
            </VStack>
          }
        />
      )}
    </>
  );
};

export default TransferPlannerSetupPage;
