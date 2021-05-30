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
import PlayerExplorerHelp from "~/components/PlayersExplorer/PlayerExplorerHelp";
import TransferPlannerHelp from "~/components/TransferPlanner/TransferPlannerHelp";

const HelpPage = () => {
  return (
    <>
      <NextSeo title="How to use | Open FPL" />
      <Box height="100%" overflow="auto">
        <Tabs>
          <TabList position="sticky" top={0} bg="white" zIndex="sticky">
            <Tab fontWeight="bold">
              <Icon as={IoPeopleCircleOutline} mr={2} /> Player Explorer
            </Tab>
            <Tab fontWeight="bold">
              <Icon as={IoSwapHorizontalOutline} mr={2} /> Transfer Planner
            </Tab>
          </TabList>
          <TabPanels>
            <TabPanel>
              <PlayerExplorerHelp />
            </TabPanel>
            <TabPanel>
              <TransferPlannerHelp />
            </TabPanel>
          </TabPanels>
        </Tabs>
      </Box>
    </>
  );
};

export default HelpPage;
