import {
  Box,
  Container,
  Flex,
  Heading,
  Icon,
  Link as A,
  Text,
  VStack,
} from "@chakra-ui/react";
import { fullChangePlayer } from "@open-fpl/app/features/Help/helpData";
import { useSettings } from "@open-fpl/app/features/Settings/Settings";
import SwapablePlayer from "@open-fpl/app/features/TeamPlanner/SwapablePlayer/SwapablePlayer";
import Link from "next/link";
// @ts-ignore
import { AnnotationCalloutRect } from "react-annotation";
import {
  IoAdd,
  IoArrowBackOutline,
  IoArrowForwardOutline,
  IoEllipsisHorizontalOutline,
  IoEllipsisVerticalOutline,
} from "react-icons/io5";

const DemoPlayerCard = () => (
  <Flex
    mx="auto"
    justifyContent="center"
    alignItems="center"
    height="350px"
    width="180px"
    position="relative"
  >
    <Box width={{ base: "70px", sm: "180px" }}>
      <SwapablePlayer player={fullChangePlayer} />
    </Box>
    <Box
      display={{ base: "none", sm: "block" }}
      as="svg"
      sx={{ width: 800, height: 350, position: "absolute" }}
    >
      <AnnotationCalloutRect
        x={397}
        y={130}
        dx={120}
        dy={0}
        subject={{ width: 95, height: 25 }}
        note={{
          title: "Selling price",
        }}
      />
      <AnnotationCalloutRect
        x={390}
        y={97}
        dx={-100}
        dy={0}
        subject={{ width: 20, height: 20 }}
        note={{
          title: "Set as vice captain",
        }}
      />
      <AnnotationCalloutRect
        x={415}
        y={97}
        dx={-80}
        dy={-50}
        subject={{ width: 20, height: 20 }}
        note={{
          title: "Set as captain",
        }}
      />
      <AnnotationCalloutRect
        x={440}
        y={97}
        dx={0}
        dy={-50}
        subject={{ width: 20, height: 20 }}
        note={{
          title: "Subsitute",
        }}
      />
      <AnnotationCalloutRect
        x={465}
        y={97}
        dx={70}
        dy={-30}
        subject={{ width: 20, height: 20 }}
        note={{
          title: "Transfer",
        }}
      />
    </Box>
  </Flex>
);

const TeamPlannerHelp = () => {
  const { onSettingsModalOpen } = useSettings();
  return (
    <>
      <Container maxW="container.lg" lineHeight="taller">
        <VStack spacing={6} alignItems="flex-start">
          <Heading as="h1" size="xl" fontWeight="black">
            Team Planner
          </Heading>
          <Text as="p">
            Team Planner is where you plan your team lineup, transfer, chip
            usage, and captain strategy for upcoming gameweeks. It also supports
            adding your own custom players for your most anticipated players
            coming into your teams!
          </Text>

          <Heading as="h2" size="lg" fontWeight="black">
            Set up your team profile
          </Heading>
          <Text as="p">
            In order to use Team Planner, you must first set up your team
            profile. Click the "Set up your profile" button in the bottom left
            corner of the page or you can click{" "}
            <A role="button" onClick={onSettingsModalOpen}>
              here to set up your profile.
            </A>{" "}
            Simply input your FPL ID there and you're good to go! You can also
            set up multiple profiles if you have more than one team.
          </Text>
          <Text as="p">
            Please do note that all data is auto-saved on your machine and not
            on our server so no one can take a peek on your plan!
          </Text>

          <Heading as="h2" size="lg" fontWeight="black">
            Team planning
          </Heading>
          <Text as="p">
            Once you've set up your profile, you can plan your lineup for the
            next gameweek. <strong>Open FPL</strong> will automatically pull and
            sync data from your actual FPL team. However, due to a technical
            limitation, that we cannot pull your team data before FPL makes it
            public so your team will be synced only the morning after the
            current gameweek deadline has passed.
          </Text>
          <Text as="p">
            Each player is respresented by a card. The anatomy of the player
            card is almost the same as described in{" "}
            <Link href="/help/players">
              <A>Player Explorer</A>
            </Link>{" "}
            but displayed in a more compact form. It also shows player's selling
            price instead of their actual price, and there are buttons to set up
            captaincy, substitute players, and make a transfer{" "}
            <Text as="span" display={{ base: "none", sm: "inline" }}>
              on the right hand side of the card which will be appeared once you
              hover your mouse there.
            </Text>{" "}
            <Text as="span" display={{ base: "inline", sm: "none" }}>
              in a menu which will be appeared once you tap on the card.
            </Text>
          </Text>
        </VStack>
      </Container>

      {/* <DemoPlayerCard /> */}

      <Container maxW="container.lg" mt={8} lineHeight="taller">
        <VStack spacing={4} alignItems="flex-start">
          <Heading as="h3" size="md" fontWeight="black">
            Lineup Planning and Transfer Planning
          </Heading>
          <Text as="p">
            Your team squad will be displayed in the middle of the screen. You
            can simply click on a player to either substitute to a bench players
            below or transfer him out using transfer market panel on the left
            side.
          </Text>
          <Text as="p">
            You can see you bank balance, remaining free transfers, hits and
            chip usage on the top toolbar. You can also navigate through future
            gameweeks by clicking on the arrows button{" "}
            <Icon aria-label="back" as={IoArrowBackOutline} />,{" "}
            <Icon aria-label="forward" as={IoArrowForwardOutline} /> beside the
            current gameweek.
          </Text>
          <Text as="p">
            To set up your captain, simply click on the captain menu button{" "}
            <Icon aria-label="captain menu" as={IoEllipsisHorizontalOutline} />{" "}
            on the right side of the player card as shown above.
          </Text>

          <Heading as="h3" size="md" fontWeight="black">
            Change Log and Summary View
          </Heading>
          <Text as="p">
            The panel between toolbar and your starting XI lineup shows your
            team changelog. You see all transactions being made in each gameweek
            and you can remove each one of them if you wish to undo your action.
          </Text>

          <Heading as="h3" size="md" fontWeight="black">
            Multiple plans
          </Heading>
          <Text as="p">
            You can have multiple plans at the same time. Simply click on the{" "}
            <Icon aria-label="add" as={IoAdd} /> add button on the tab pannel on
            the top of screen. You can rearrange the tab by dragging them
            around. You can also rename or remove it by clicking{" "}
            <Icon aria-label="menu" as={IoEllipsisVerticalOutline} /> on the
            menu next to the tab name.
          </Text>
          <Text as="p">
            Please do note that there is a limit of how many plans you can have
            depends on what browser you are using. Since some browsers have
            regular update and the size limitation can be changed any time so it
            is hard to say how many plans you can have. Generally, any
            up-to-date browsers should be able to handle up to 10 plans.
          </Text>

          <Heading as="h2" size="lg" fontWeight="black">
            Custom players
          </Heading>
          <Text as="p">
            In case you want to include a player that is not yet in FPL, you can
            add them as custom players. Simply click on the button on the top
            right of the screen to open the custom player panel. You can add,
            edit, and remove players from there. Please do note that once you
            modify their team or position, the player will be removed from all
            team plan and you can to re-add them manually later.
          </Text>
        </VStack>
      </Container>
    </>
  );
};

export default TeamPlannerHelp;
