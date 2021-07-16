import { Button, Link as A, Spinner, Text, VStack } from "@chakra-ui/react";
import { NextSeo } from "next-seo";
import Link from "next/link";
import AppLayout from "~/features/Layout/AppLayout";
import FullScreenMessage from "~/features/Layout/FullScreenMessage";
import { baseUrl } from "~/features/Navigation/internalUrls";
import getOgImage from "~/features/OpenGraphImages/getOgImage";
import { useSettings } from "~/features/Settings/SettingsContext";
import useTeamPlannerRedirect from "~/features/TeamPlanner/useTeamPlannerRedirect";

const TransferPlannerSetupPage = () => {
  const { teamId } = useTeamPlannerRedirect();
  const { onSettingsModalOpen } = useSettings();

  let mainContent = null;

  if (teamId) {
    mainContent = (
      <FullScreenMessage
        symbol={<Spinner size="xl" />}
        heading="One moment..."
        text={
          <VStack spacing={6}>
            <Text>
              Please wait while we are bringing you to your Team Planner page.
            </Text>
            <Link href={`/teams/${teamId}`} passHref>
              <A>
                <Button size="md" onClick={onSettingsModalOpen} variant="link">
                  Click here if it does not work
                </Button>
              </A>
            </Link>
          </VStack>
        }
      />
    );
  } else {
    mainContent = (
      <FullScreenMessage
        symbol="((((つ•̀ω•́)つ"
        heading="Set up a profile to get started"
        text={
          <VStack spacing={6}>
            <Text>
              Set up a profile with your Team ID to access Team Planner
            </Text>
            <Button size="md" onClick={onSettingsModalOpen}>
              Set up your profile
            </Button>
          </VStack>
        }
      />
    );
  }

  return (
    <>
      <NextSeo
        title="Team Planner – Open FPL"
        description="Plan your team lineup, transfers, captain and chip usage ahead of upcoming Fantasy Premier League gameweeks."
        canonical={`${baseUrl}/teams`}
        openGraph={{
          url: `${baseUrl}/teams`,
          title: "Team Planner – Open FPL",
          description:
            "Plan your team lineup, transfers, captain and chip usage ahead of upcoming Fantasy Premier League gameweeks.",
          images: [
            {
              url: getOgImage("Team Planner.png?width=800,height=600"),
              width: 800,
              height: 600,
              alt: "Team Planner – Open FPL",
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
      <AppLayout>{mainContent}</AppLayout>
    </>
  );
};

export default TransferPlannerSetupPage;
