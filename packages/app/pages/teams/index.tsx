import { Button, Link as A, Spinner, Text, VStack } from "@chakra-ui/react";
import AppLayout from "@open-fpl/app/features/Layout/AppLayout";
import FullScreenMessageWithAppDrawer from "@open-fpl/app/features/Layout/FullScreenMessageWithAppDrawer";
import { origin } from "@open-fpl/app/features/Navigation/internalUrls";
import getOgImage from "@open-fpl/app/features/OpenGraphImages/getOgImage";
import { useSettings } from "@open-fpl/app/features/Settings/Settings";
import useTeamPlannerRedirect from "@open-fpl/app/features/TeamPlanner/useTeamPlannerRedirect";
import { NextSeo } from "next-seo";
import Link from "next/link";

const TransferPlannerSetupPage = () => {
  const { profile } = useTeamPlannerRedirect();
  const { onSettingsModalOpen } = useSettings();

  let mainContent = null;

  if (profile) {
    mainContent = (
      <FullScreenMessageWithAppDrawer
        as="main"
        symbol={<Spinner size="xl" />}
        heading="One moment..."
        text={
          <VStack spacing={6}>
            <Text as="span">
              Please wait while we are bringing you to your Team Planner page.
            </Text>
            <Link href={`/teams/${profile}`} passHref>
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
      <FullScreenMessageWithAppDrawer
        as="main"
        symbol="((((つ•̀ω•́)つ"
        heading="Set up a profile to get started"
        text={
          <VStack spacing={6}>
            <Text as="span">
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
        canonical={`${origin}/teams`}
        openGraph={{
          url: `${origin}/teams`,
          title: "Team Planner – Open FPL",
          description:
            "Plan your team lineup, transfers, captain and chip usage ahead of upcoming Fantasy Premier League gameweeks.",
          images: [
            {
              url: getOgImage("Team Planner.png?width=100,height=100"),
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
