import { Button, Link as A, Spinner, Text, VStack } from "@chakra-ui/react";
import { NextSeo } from "next-seo";
import Link from "next/link";
import AppLayout from "~/features/Layout/AppLayout";
import FullScreenMessage from "~/features/Layout/FullScreenMessage";
import { baseUrl } from "~/features/Navigation/internalUrls";
import { useSettings } from "~/features/Settings/SettingsContext";
import useTransferRedirect from "~/features/TransferPlanner/useTransferRedirect";

const TransferPlannerSetupPage = () => {
  const { teamId } = useTransferRedirect();
  const { onSettingsModalOpen } = useSettings();

  return (
    <>
      <NextSeo
        title="Transfer Planner – Open FPL"
        description="Plan your transfer, starting lineup and your bench ahead of upcoming Fantasy Premier League gameweeks."
        canonical={`${baseUrl}/transfers`}
        openGraph={{
          url: `${baseUrl}/transfers`,
          title: "Transfer Planner – Open FPL",
          description:
            "Plan your transfer, starting lineup and your bench ahead of upcoming Fantasy Premier League gameweeks.",
          images: [
            {
              url: `${baseUrl}/api/ogimages/Transfers Planner.png?width=800,height=600`,
              width: 800,
              height: 600,
              alt: "Transfer Planner – Open FPL",
            },
          ],
          site_name: "Open FPL",
        }}
        twitter={{
          handle: "@openfpl",
          site: "@openfpl",
          cardType: "summary_large_image",
        }}
      />
      <AppLayout>
        {teamId ? (
          <FullScreenMessage
            symbol={<Spinner size="xl" />}
            heading="One moment..."
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
      </AppLayout>
    </>
  );
};

export default TransferPlannerSetupPage;
