import {
  Box,
  Icon,
  Tab,
  TabList,
  TabPanel,
  TabPanels,
  Tabs,
} from "@chakra-ui/react";
import { NextSeo } from "next-seo";
import {
  IoPeopleCircleOutline,
  IoSwapHorizontalOutline,
} from "react-icons/io5";
import AppLayout from "~/features/Layout/AppLayout";
import { baseUrl } from "~/features/Navigation/internalUrls";
import PlayersExplorerHelp from "~/features/PlayersExplorer/PlayersExplorerHelp";
import TeamPlannerHelp from "~/features/TeamPlanner/TeamPlannerHelp";

const HelpPage = () => {
  return (
    <>
      <NextSeo
        title="How to use – Open FPL"
        description="How to use each open-source tool on Open FPL to help you enjoy Fantasy Premier League more."
        canonical={`${baseUrl}/help`}
        openGraph={{
          url: `${baseUrl}/help`,
          title: "How to use – Open FPL",
          description:
            "How to use each open-source tool on Open FPL to help you enjoy Fantasy Premier League more.",
          images: [
            {
              url: `${baseUrl}/api/ogimages/How to use.png?width=800,height=600`,
              width: 800,
              height: 600,
              alt: "How to use – Open FPL",
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
        <Box as="main" height="100%" overflow="auto">
          <Tabs>
            <TabList position="sticky" top={0} bg="white" zIndex="sticky">
              <Tab fontWeight="bold">
                <Icon as={IoPeopleCircleOutline} mr={2} /> Player Explorer
              </Tab>
              <Tab fontWeight="bold">
                <Icon as={IoSwapHorizontalOutline} mr={2} /> Team Planner
              </Tab>
            </TabList>
            <TabPanels>
              <TabPanel>
                <PlayersExplorerHelp />
              </TabPanel>
              <TabPanel>
                <TeamPlannerHelp />
              </TabPanel>
            </TabPanels>
          </Tabs>
        </Box>
      </AppLayout>
    </>
  );
};

export default HelpPage;
