import { Button, Link as A, Spinner, Text, VStack } from "@chakra-ui/react";
import useProfileRedirect from "@open-fpl/app/features/Common/useProfileRedirect";
import AppLayout from "@open-fpl/app/features/Layout/AppLayout";
import FullScreenMessageWithAppDrawer from "@open-fpl/app/features/Layout/FullScreenMessageWithAppDrawer";
import { origin } from "@open-fpl/app/features/Navigation/internalUrls";
import getOgImage from "@open-fpl/app/features/OpenGraphImages/getOgImage";
import { useSettings } from "@open-fpl/app/features/Settings/Settings";
import { NextSeo } from "next-seo";
import Link from "next/link";

const IdCardSetupPage = () => {
  const { profile } = useProfileRedirect("/cards");
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
              Please wait while we are bringing you to your ID Card page.
            </Text>
            <Link href={`/cards/${profile}`} passHref>
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
              Set up a profile with your Team ID to access ID Card
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
        title="ID Card – Open FPL"
        description="Create your unique ID card to show off your Fantasy Premier League rankings."
        canonical={`${origin}/cards`}
        openGraph={{
          url: `${origin}/cards`,
          title: "ID Card – Open FPL",
          description:
            "Create your unique ID card to show off your Fantasy Premier League rankings.",
          images: [
            {
              url: getOgImage("ID Card.png?width=100,height=100"),
              width: 800,
              height: 600,
              alt: "ID Card – Open FPL",
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

export default IdCardSetupPage;
