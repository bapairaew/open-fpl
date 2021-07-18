import {
  Box,
  BoxProps,
  Code,
  Container,
  Flex,
  Heading,
  Link as A,
  ListItem,
  OrderedList,
  Text,
  UnorderedList,
  VStack,
} from "@chakra-ui/react";
import Link from "next/link";
// @ts-ignore
import { AnnotationCalloutRect } from "react-annotation";
import { gameweeks, player } from "~/features/Help/helpData";
import PlayerGridCard from "~/features/PlayerData/PlayerGridCard";
import PlayersExplorerToolbar from "~/features/PlayersExplorer/PlayersExplorerToolbar";
import PlayerTableHeaderRow from "../PlayerData/PlayerTableHeaderRow";

const ComponentWithHighlight = ({
  children,
  highlight,
  ...props
}: BoxProps & {
  highlight: BoxProps;
}) => (
  <Box position="relative" {...props}>
    <Box position="absolute" bg="yellow.100" {...highlight} />
    {children}
  </Box>
);

const DemoPlayerCard = () => (
  <Flex
    mx="auto"
    justifyContent="center"
    alignItems="center"
    height="600px"
    width="800px"
    position="relative"
  >
    <Box width="400px">
      <PlayerGridCard player={player} gameweeks={gameweeks} />
    </Box>
    <Box as="svg" sx={{ width: 800, height: 600, position: "absolute" }}>
      <AnnotationCalloutRect
        x={251}
        y={176}
        dx={-78}
        dy={-44}
        subject={{ width: -50, height: 32 }}
        note={{
          title: "Team",
        }}
      />
      <AnnotationCalloutRect
        x={251}
        y={208}
        dx={-139}
        dy={-6}
        subject={{ width: -50, height: 32 }}
        note={{
          title: "Position",
        }}
      />
      <AnnotationCalloutRect
        x={251}
        y={176}
        dx={-2}
        dy={-98}
        subject={{ width: 32, height: 64 }}
        note={{
          title: "Player status",
        }}
      />
      <AnnotationCalloutRect
        x={283}
        y={176}
        dx={16}
        dy={-48}
        subject={{ width: 139, height: 30 }}
        note={{
          title: "Player name",
        }}
      />
      <AnnotationCalloutRect
        x={357}
        y={210}
        dx={96}
        dy={-76}
        subject={{ width: -70, height: 19 }}
        note={{
          title: "FPL ID",
        }}
      />
      <AnnotationCalloutRect
        x={530}
        y={176}
        dx={79}
        dy={-64}
        subject={{ width: 70, height: 32 }}
        note={{
          title: "Cost",
        }}
      />
      <AnnotationCalloutRect
        x={530}
        y={208}
        dx={137}
        dy={-32}
        subject={{ width: 70, height: 32 }}
        note={{
          title: "Ownership",
        }}
      />
      <AnnotationCalloutRect
        x={200}
        y={241}
        dx={-57}
        dy={13}
        subject={{ width: 400, height: 45 }}
        note={{
          title: "Next fixtures",
        }}
      />
      <AnnotationCalloutRect
        x={200}
        y={286}
        dx={-50}
        dy={52}
        subject={{ width: 400, height: 55 }}
        note={{
          title: "Previous fixtures FPL points",
        }}
      />
      <AnnotationCalloutRect
        x={200}
        y={366}
        dx={470}
        dy={-44}
        subject={{ width: 400, height: 28 }}
        note={{
          title: "Previous fixtures xGI",
        }}
      />
      <AnnotationCalloutRect
        x={200}
        y={394}
        dx={465}
        dy={78}
        subject={{ width: 400, height: 29 }}
        note={{
          title: "Previous fixtures xGC",
        }}
      />
    </Box>
  </Flex>
);

const PlayersExplorerHelp = () => {
  return (
    <>
      <Container maxW="container.lg" mt={6}>
        <VStack spacing={4} alignItems="flex-start">
          <Heading as="h1" size="xl" fontWeight="black">
            Player Explorer
          </Heading>
          <Text as="p">
            This page explains the data embeded in Player Card and how to use
            each component in{" "}
            <Link href="/players" passHref>
              <A color="brand.500">Player Explorer</A>
            </Link>{" "}
            page.
          </Text>

          <Heading as="h2" size="lg" fontWeight="black">
            Player Card
          </Heading>
          <Text as="p">
            Player Card is the main way to display player statistics in this
            app. It is used in Player Explorer Grid view and Team Planner. The
            following describes the anatomy of a Player Card.
          </Text>
        </VStack>
      </Container>

      <DemoPlayerCard />

      <Container maxW="container.lg">
        <VStack spacing={4} alignItems="flex-start">
          <Heading as="h2" size="lg" fontWeight="black">
            Player Data
          </Heading>
          <Text as="p">
            Player data is scraped from{" "}
            <A
              color="brand.500"
              isExternal
              href="https://fantasy.premierleague.com/"
            >
              FPL
            </A>{" "}
            and{" "}
            <A color="brand.500" isExternal href="https://understat.com/">
              Understat
            </A>{" "}
            which is updated once a day around 02:00 AM - 03:00 AM GMT+0.
          </Text>
          <Heading as="h2" size="lg" fontWeight="black">
            Search for players
          </Heading>

          <Heading as="h3" size="md" fontWeight="black">
            Filtering
          </Heading>

          <Text as="p">
            Player Search Bar supports free text search which will do fuzzy
            search on players' full name hence if you typed "Paul", the search
            results would show (Paul) Pogba and (Paul) Dummett.
          </Text>
          <Box pointerEvents="none">
            <ComponentWithHighlight
              highlight={{
                top: "10px",
                left: "10px",
                width: "80px",
                height: "30px",
              }}
            >
              <PlayersExplorerToolbar
                borderWidth={1}
                initialSeachQuery="Paul"
              />
            </ComponentWithHighlight>
          </Box>
          <Text as="p">
            It also supports search query syntax like when you do email search.
            For example, if you want to specifically find a player based on
            their name FPL page you can use field search <Code>name</Code> like
            shown below:
          </Text>
          <Box pointerEvents="none">
            <ComponentWithHighlight
              highlight={{
                top: "10px",
                left: "10px",
                width: "140px",
                height: "30px",
              }}
            >
              <PlayersExplorerToolbar
                borderWidth={1}
                initialSeachQuery="name:Pogba"
              />
            </ComponentWithHighlight>
          </Box>
          <Box mt={4} mb={2}>
            Currently, it supports the following fields:
            <UnorderedList ml={6}>
              <ListItem my={2}>
                <VStack spacing={2} alignItems="flex-start">
                  <Text>
                    <Code>id</Code> - FPL ID
                  </Text>
                  <Box pointerEvents="none">
                    <ComponentWithHighlight
                      highlight={{
                        top: "10px",
                        left: "10px",
                        width: "100px",
                        height: "30px",
                      }}
                    >
                      <PlayersExplorerToolbar
                        borderWidth={1}
                        initialSeachQuery="id:296"
                      />
                    </ComponentWithHighlight>
                  </Box>
                </VStack>
              </ListItem>
              <ListItem my={2}>
                <VStack spacing={2} alignItems="flex-start">
                  <Text>
                    <Code>name</Code> - FPL web name
                  </Text>
                  <Box pointerEvents="none">
                    <ComponentWithHighlight
                      highlight={{
                        top: "10px",
                        left: "10px",
                        width: "140px",
                        height: "30px",
                      }}
                    >
                      <PlayersExplorerToolbar
                        borderWidth={1}
                        initialSeachQuery="name:Pogba"
                      />
                    </ComponentWithHighlight>
                  </Box>
                </VStack>
              </ListItem>
              <ListItem my={2}>
                <VStack spacing={2} alignItems="flex-start">
                  <Text>
                    <Code>cost</Code> - FPL player's cost range
                  </Text>
                  <Box pointerEvents="none">
                    <ComponentWithHighlight
                      highlight={{
                        top: "10px",
                        left: "10px",
                        width: "120px",
                        height: "30px",
                      }}
                    >
                      <PlayersExplorerToolbar
                        borderWidth={1}
                        initialSeachQuery="cost:4-10"
                      />
                    </ComponentWithHighlight>
                  </Box>
                </VStack>
              </ListItem>
              <ListItem my={2}>
                <VStack spacing={4} alignItems="flex-start">
                  <Text>
                    <Code>position</Code> - FPL positon (FWD, MID, DEF, GKP)
                  </Text>
                  <Box pointerEvents="none">
                    <ComponentWithHighlight
                      highlight={{
                        top: "10px",
                        left: "10px",
                        width: "140px",
                        height: "30px",
                      }}
                    >
                      <PlayersExplorerToolbar
                        borderWidth={1}
                        initialSeachQuery="position:MID"
                      />
                    </ComponentWithHighlight>
                  </Box>
                </VStack>
              </ListItem>
              <ListItem my={2}>
                <VStack spacing={4} alignItems="flex-start">
                  <Text>
                    <Code>team</Code> - FPL short team name (e.g. MUN, LIV, MCI)
                  </Text>
                  <Box pointerEvents="none">
                    <ComponentWithHighlight
                      highlight={{
                        top: "10px",
                        left: "10px",
                        width: "120px",
                        height: "30px",
                      }}
                    >
                      <PlayersExplorerToolbar
                        borderWidth={1}
                        initialSeachQuery="team:MUN"
                      />
                    </ComponentWithHighlight>
                  </Box>
                </VStack>
              </ListItem>
            </UnorderedList>
          </Box>
          <Text as="p">
            You can also do field keyword combination to expand your search
            results, for example, if you want to search for players from
            Manchester United OR Liverpool you can do the following:
          </Text>
          <Box pointerEvents="none">
            <ComponentWithHighlight
              highlight={{
                top: "10px",
                left: "10px",
                width: "150px",
                height: "30px",
              }}
            >
              <PlayersExplorerToolbar
                borderWidth={1}
                initialSeachQuery="name:MUN,LIV"
              />
            </ComponentWithHighlight>
          </Box>
          <Text as="p">
            Or if you want to narrow down your search result you could append
            anoter field search query, for example, the following will show
            Manchester United midfield players
          </Text>
          <Box pointerEvents="none">
            <ComponentWithHighlight
              highlight={{
                top: "10px",
                left: "10px",
                width: "220px",
                height: "30px",
              }}
            >
              <PlayersExplorerToolbar
                borderWidth={1}
                initialSeachQuery="team:MUN position:MID"
              />
            </ComponentWithHighlight>
          </Box>
          <Text as="p">
            You can also exclude some search results use exclusion prefix `-`
            like shown below how to exclude Pogba from search results. Please
            also note that range search (e.g. cost) DOES NOT support exclusion
            yet.
          </Text>
          <Box pointerEvents="none">
            <ComponentWithHighlight
              highlight={{
                top: "10px",
                left: "10px",
                width: "330px",
                height: "30px",
              }}
            >
              <PlayersExplorerToolbar
                borderWidth={1}
                initialSeachQuery="team:MUN position:MID -name:Pogba"
              />
            </ComponentWithHighlight>
          </Box>

          <Heading as="h3" size="sm" fontWeight="black">
            Sorting
          </Heading>

          <Text as="p">
            You can sort the results by using the dropdown besides the search
            text box or the menu button on each table header column if you are
            on Table view mode.
          </Text>

          <Box pointerEvents="none">
            <ComponentWithHighlight
              highlight={{
                top: 0,
                right: 98,
                width: "225px",
                height: "100%",
              }}
            >
              <PlayersExplorerToolbar borderWidth={1} />
            </ComponentWithHighlight>
          </Box>

          <Box
            borderWidth={1}
            pointerEvents="none"
            overflow="hidden"
            width="100%"
          >
            <ComponentWithHighlight
              highlight={{
                top: 0,
                left: "380px",
                width: "30px",
                height: "100%",
              }}
            >
              <PlayerTableHeaderRow />
            </ComponentWithHighlight>
          </Box>

          <Heading as="h3" size="sm" fontWeight="black">
            Display mode
          </Heading>

          <Text as="p">
            You can choose between three display modes: Grid, Table and Chart,
            each of which shows slightly different data to fit their
            visualisation.
          </Text>

          <Text as="p">
            <OrderedList spacing={2}>
              <ListItem>
                <strong>Grid</strong> consists of the most important player
                statistics that focuses on the recency and player form to give
                you a quick glance of how a player has been performed and what
                their next opponents are.
              </ListItem>
              <ListItem>
                <strong>Table</strong> shows more detailed statistics for each
                player to give your the overall player profile if you decide to
                dig deeper in each player performance.
              </ListItem>
              <ListItem>
                <strong>Chart</strong> shows alternative visualisation that aims
                to help you compare between different players easier.
              </ListItem>
            </OrderedList>
          </Text>
        </VStack>
      </Container>
    </>
  );
};

export default PlayersExplorerHelp;
