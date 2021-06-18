import {
  Box,
  Container,
  Flex,
  Heading,
  Link as A,
  ListItem,
  Text,
  UnorderedList,
} from "@chakra-ui/react";
import Link from "next/link";
// @ts-ignore
import { AnnotationCalloutRect } from "react-annotation";
import PlayerCard from "~/features/PlayerCard/PlayerCard";
import { gameweeks, player } from "~/features/PlayersExplorer/helpData";
import PlayerSearchBar from "~/features/PlayersExplorer/PlayerSearchBar";

const PlayerExplorerHelp = () => {
  return (
    <>
      <Container my={4}>
        <Heading as="h1" size="lg" fontWeight="black">
          Player Explorer
        </Heading>
        <Text my={4} as="p">
          This page explains the data embeded in Player Card and how to use each
          component in{" "}
          <Link href="/" passHref>
            <A color="brand.500">Player Explorer</A>
          </Link>{" "}
          page.
        </Text>
        <Heading my={4} as="h2" size="md" fontWeight="black">
          Player Card
        </Heading>
        <Text my={4} as="p">
          Player Card consists of some relevant statistic data that you would
          gernerally want to know in order to decide if you want to include the
          player in your team or not.
        </Text>
        <Text my={4} as="p">
          The data is scraped from{" "}
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
          and updated once a day around 02:00 AM - 03:00 GMT+0.
        </Text>
      </Container>

      <Flex
        mx="auto"
        justifyContent="center"
        alignItems="center"
        height={600}
        width={800}
        position="relative"
      >
        <Box width={400}>
          <PlayerCard player={player} gameweeks={gameweeks} />
        </Box>
        <Box as="svg" sx={{ width: 800, height: 600, position: "absolute" }}>
          <AnnotationCalloutRect
            x={255}
            y={177}
            dx={-78}
            dy={-44}
            subject={{ width: -54, height: 32 }}
            note={{
              title: "Team",
            }}
          />
          <AnnotationCalloutRect
            x={255}
            y={209}
            dx={-139}
            dy={-6}
            subject={{ width: -54, height: 32 }}
            note={{
              title: "Position",
            }}
          />
          <AnnotationCalloutRect
            x={255}
            y={177}
            dx={-2}
            dy={-98}
            subject={{ width: 32, height: 64 }}
            note={{
              title: "Player status",
            }}
          />
          <AnnotationCalloutRect
            x={287}
            y={177}
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
            x={539}
            y={176}
            dx={79}
            dy={-64}
            subject={{ width: 60, height: 32 }}
            note={{
              title: "Cost",
            }}
          />
          <AnnotationCalloutRect
            x={539}
            y={208}
            dx={137}
            dy={-32}
            subject={{ width: 60, height: 32 }}
            note={{
              title: "Net transfers",
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

      <Container my={4}>
        <Heading my={4} as="h2" size="md" fontWeight="black">
          Player Search Bar
        </Heading>

        <Heading my={4} as="h3" size="sm" fontWeight="black">
          Filtering
        </Heading>

        <Text my={4} as="p">
          Player Search Bar supports free text search which will do fuzzy search
          on players' full name hence if you typed "Paul", the search results
          would show (Paul) Pogba and (Paul) Dummett.
        </Text>
        <Box my={4} pointerEvents="none">
          <PlayerSearchBar initialSeachQuery="Paul" />
        </Box>
        <Text my={4} as="p">
          It also supports search query syntax like when you do email search.
          For example, if you want to specifically find a player based on their
          name FPL page you can use field search <code>name</code> like shown
          below:
        </Text>
        <Box my={4} pointerEvents="none">
          <PlayerSearchBar initialSeachQuery="name:Pogba" />
        </Box>
        <Box mt={4} mb={2}>
          Currently, it supports the following fields:
          <UnorderedList my={4} ml={6}>
            <ListItem my={2}>
              <Text>
                <code>id</code> - FPL ID
              </Text>
              <Box my={4} pointerEvents="none">
                <PlayerSearchBar initialSeachQuery="id:296" />
              </Box>
            </ListItem>
            <ListItem my={2}>
              <Text>
                <code>name</code> - FPL web name
              </Text>
              <Box my={4} pointerEvents="none">
                <PlayerSearchBar initialSeachQuery="name:Pogba" />
              </Box>
            </ListItem>
            <ListItem my={2}>
              <Text>
                <code>cost</code> - FPL player's cost range
              </Text>
              <Box my={4} pointerEvents="none">
                <PlayerSearchBar initialSeachQuery="cost:4-10" />
              </Box>
            </ListItem>
            <ListItem my={2}>
              <Text>
                <code>position</code> - FPL positon (FWD, MID, DEF, GKP)
              </Text>
              <Box my={4} pointerEvents="none">
                <PlayerSearchBar initialSeachQuery="position:MID" />
              </Box>
            </ListItem>
            <ListItem my={2}>
              <Text>
                <code>team</code> - FPL short team name (e.g. MUN, LIV, MCI)
              </Text>
              <Box my={4} pointerEvents="none">
                <PlayerSearchBar initialSeachQuery="team:MUN" />
              </Box>
            </ListItem>
          </UnorderedList>
        </Box>
        <Text my={4} as="p">
          You can also do field keyword combination to expand your search
          results, for example, if you want to search for players from
          Manchester United OR Liverpool you can do the following:
        </Text>
        <Box my={4} pointerEvents="none">
          <PlayerSearchBar initialSeachQuery="name:MUN,LIV" />
        </Box>
        <Text my={4} as="p">
          Or if you want to narrow down your search result you could append
          anoter field search query, for example, the following will show
          Manchester United midfield players
        </Text>
        <Box my={4} pointerEvents="none">
          <PlayerSearchBar initialSeachQuery="team:MUN position:MID" />
        </Box>
        <Text my={4} as="p">
          You can also exclude some search results use exclusion prefix `-` like
          shown below how to exclude Pogba from search results. Please also note
          that range search (e.g. cost) DOES NOT support exclusion yet.
        </Text>
        <Box my={4} pointerEvents="none">
          <PlayerSearchBar initialSeachQuery="team:MUN position:MID -name:Pogba" />
        </Box>

        <Heading my={4} as="h3" size="sm" fontWeight="black">
          Sorting
        </Heading>

        <Text my={4} as="p">
          You can sort the results by using the dropdown besides the search text
          box. The default is "Best Fixtures" which is calculated from FPL match
          difficulty.
        </Text>
      </Container>
    </>
  );
};

export default PlayerExplorerHelp;
