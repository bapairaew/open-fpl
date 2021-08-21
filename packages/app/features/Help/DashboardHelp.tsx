import {
  Container,
  Heading,
  Link as A,
  Text,
  VStack,
  Badge,
  Box,
  Icon,
} from "@chakra-ui/react";
import Link from "next/link";
import { IoOpenOutline } from "react-icons/io5";

const DashboardHelp = () => (
  <>
    <Container maxW="container.lg" lineHeight="taller">
      <VStack spacing={6} alignItems="flex-start">
        <Heading as="h1" size="xl" fontWeight="black">
          "Live" Dashboard
        </Heading>
        <Text as="p">
          Well, actually, I do not want to set a false expectation here.{" "}
          <Link href="/" passHref>
            <A>Open FPL "Live" Dashboard</A>
          </Link>{" "}
          is not really real-time but it is quite close though - match results
          and player points are updated every minute while, unfortunately, ranks
          are only updated after matches finished. This is mostly due to some
          technical limitations which are needed to keep Open FPL free and open
          for everyone while also does not put much workload on the data source
          side. However, Open FPL will keep improving and maybe one day it will
          truly be "live" while still free.
        </Text>
        <Text as="p">
          Anyway, the objective of this page is to give you a quick overview of
          the current and future FPL Gameweeks. It is packed with the
          information that you would want to know about in the ongoing matches -
          e.g. score, and player points, automatically updated without
          refreshing the page. It also shows you the fixtures of next gameweek,
          deadline and gameweek's top transfers to help you see the current
          trend and make a good decision based on it.
        </Text>

        <Heading as="h2" size="lg" fontWeight="black">
          This Gameweek tab
        </Heading>
        <Text as="p">
          Shows the information about the current ongoing fixtures with "live"
          update. It is auto-refreshed every minute so you can just leave the
          page open to get the update just like any other live score websites.
        </Text>

        <Heading as="h3" size="md" fontWeight="black">
          Summary section
        </Heading>
        <Text as="p">
          Shows your live current overall points and update-after-match overall
          ranking.
        </Text>

        <Heading as="h3" size="md" fontWeight="black">
          Your Team
        </Heading>
        <Text as="p">
          You can find your players' live points here.{" "}
          <Badge colorScheme="red">Live</Badge> will be displayed if the
          player's game is live and <Badge>Picked</Badge> will be shown if they
          are in your starting XI. You can also expand a table view by clicking{" "}
          <Box as="span" layerStyle="brand" fontWeight="bold">
            See all
          </Box>{" "}
          on the far right of the screen.
        </Text>

        <Heading as="h3" size="md" fontWeight="black">
          Live Fixtures
        </Heading>
        <Text as="p">
          Shows live scores and live points including bonus points of each
          player in the match. Player in your team will be{" "}
          <Box as="span" layerStyle="brand">
            highlighted in color
          </Box>{" "}
          and will always be on the top of the list. You also see players live
          BPS by clicking on each the fixture card.
        </Text>

        <Heading as="h3" size="md" fontWeight="black">
          Top Players
        </Heading>
        <Text as="p">
          Shows players with the highest points in the gamweek. To see all
          player points, just click{" "}
          <Box as="span" layerStyle="brand" fontWeight="bold">
            See all
          </Box>{" "}
          button on the far right. Players in your team will be highlighed with
          a coloured dot{" "}
          <Box
            as="span"
            width="6px"
            height="6px"
            layerStyle="brandSolid"
            display="inline-block"
            borderRadius="50%"
          />{" "}
          and players in a live match will be highlighed with a red dot{" "}
          <Box
            as="span"
            width="6px"
            height="6px"
            layerStyle="redSolid"
            display="inline-block"
            borderRadius="50%"
          />
          .
        </Text>

        <Heading as="h3" size="md" fontWeight="black">
          Finished Fixtures
        </Heading>
        <Text as="p">
          Shows score of the finished matches with xG when it is available on{" "}
          <A isExternal href="https://understat.com/">
            Understat <Icon as={IoOpenOutline} />
          </A>
          . You can expand more details of each match by clicking on the card.
        </Text>

        <Heading as="h3" size="md" fontWeight="black">
          Upcoming Fixtures
        </Heading>
        <Text as="p">
          The remaining matches in the gameweek. The size of the bar under the
          teams' name visualise difference in teams' strength calculated from{" "}
          <Link href="/fixtures" passHref>
            <A>Fixture Difficulty Rating page</A>
          </Link>
          . You can click on the card to see more statistics for each team.
        </Text>

        <Heading as="h2" size="lg" fontWeight="black">
          Next Gameweek tab
        </Heading>
        <Text as="p">
          Shows the information about the next gameweek and some other related
          information.
        </Text>

        <Heading as="h3" size="md" fontWeight="black">
          Deadline Countdown
        </Heading>
        <Text as="p">
          Basically a countdown to the next gameweek's transfer deadline.
          Nothing facny here.
        </Text>

        <Heading as="h3" size="md" fontWeight="black">
          Top Transfers
        </Heading>
        <Text as="p">
          Showing the top transferred players sorted by absolute transfers
          volume. Click{" "}
          <Box as="span" layerStyle="brand" fontWeight="bold">
            See all
          </Box>{" "}
          button on the right to see all players which players on your team will
          be highlighed with a coloured dot{" "}
          <Box
            as="span"
            width="6px"
            height="6px"
            layerStyle="brandSolid"
            display="inline-block"
            borderRadius="50%"
          />
          .
        </Text>

        <Heading as="h3" size="md" fontWeight="black">
          Next gameweek
        </Heading>
        <Text as="p">
          Shows all games in next gameweek. The teams' strength difference
          calculated from{" "}
          <Link href="/fixtures" passHref>
            <A>Fixture Difficulty Rating page</A>
          </Link>{" "}
          is also visualise here on the bar under teams name. The card is also
          clickable to expand more match details.
        </Text>
      </VStack>
    </Container>
  </>
);

export default DashboardHelp;
