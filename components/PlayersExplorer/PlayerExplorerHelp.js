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
import { AnnotationCalloutRect } from "react-annotation";
import PlayerCard from "~/components/PlayerCard/PlayerCard";
import PlayerSearchBar from "~/components/PlayersExplorer/PlayerSearchBar";

const player = {
  id: 302,
  name: "Bruno Miguel Borges Fernandes",
  web_name: "Fernandes",
  news: "Too good",
  status: "d",
  now_cost: 115,
  photo: "141746.jpg",
  chance_of_playing_next_round: null,
  chance_of_playing_this_round: null,
  total_points: 228,
  transfers_in_event: 2524,
  transfers_out_event: 31638,
  element_type: {
    singular_name_short: "MID",
  },
  team: {
    id: 13,
    short_name: "MUN",
  },
  linked_data: {
    understat_id: "1228",
    past_matches: [
      {
        opponent_short_title: "BHA",
        is_home: true,
        match_xgi: 0.7231284081935883,
        match_xga: 1.41071,
      },
      {
        opponent_short_title: "TOT",
        is_home: false,
        match_xgi: 0.7817299589514732,
        match_xga: 0.921801,
      },
      {
        opponent_short_title: "BUR",
        is_home: true,
        match_xgi: 0.44403740763664246,
        match_xga: 0.959804,
      },
      {
        opponent_short_title: "LEE",
        is_home: false,
        match_xgi: 0.5469669923186302,
        match_xga: 0.216834,
      },
      {
        opponent_short_title: "AVL",
        is_home: false,
        match_xgi: 1.067942786961794,
        match_xga: 0.565472,
      },
    ],
    season_xgi: 0.8092587503113785,
    season_xga: 1.0710169999999999,
    teamcolorcodes: {
      team: "Man Utd",
      background: "#dc1f29",
      text: "#fae935",
      highlight: "#000",
    },
    transfers_delta_event: -29114,
    previous_gameweeks: [
      {
        opponent_team_short_name: "BUR",
        was_home: true,
        kickoff_time: "2021-04-18T15:00:00Z",
        total_points: 2,
        bps: 7,
        minutes: 90,
      },
      {
        opponent_team_short_name: "LEE",
        was_home: false,
        kickoff_time: "2021-04-25T13:00:00Z",
        total_points: 3,
        bps: 13,
        minutes: 90,
      },
      {
        opponent_team_short_name: "AVL",
        was_home: false,
        kickoff_time: "2021-05-09T13:05:00Z",
        total_points: 7,
        bps: 27,
        minutes: 85,
      },
      {
        opponent_team_short_name: "LEI",
        was_home: true,
        kickoff_time: "2021-05-11T17:00:00Z",
        total_points: 0,
        bps: 0,
        minutes: 0,
      },
      {
        opponent_team_short_name: "LIV",
        was_home: true,
        kickoff_time: "2021-05-13T19:15:00Z",
        total_points: 0,
        bps: 0,
        minutes: 0,
      },
    ],
    next_gameweeks: [
      {
        opponent_team_short_name: "FUL",
        is_home: true,
        event: 37,
        finished: false,
        difficulty: 2,
      },
      {
        opponent_team_short_name: "WOL",
        is_home: false,
        event: 38,
        finished: false,
        difficulty: 3,
      },
    ],
  },
};

const gameweeks = [
  {
    id: 34,
    deadline_time: "2021-05-23T13:30:00Z",
    is_previous: false,
    is_current: true,
    is_next: false,
  },
  {
    id: 35,
    deadline_time: "2021-05-23T13:30:00Z",
    is_previous: false,
    is_current: false,
    is_next: true,
  },
  {
    id: 36,
    deadline_time: "2021-05-23T13:30:00Z",
    is_previous: false,
    is_current: false,
    is_next: false,
  },
  {
    id: 37,
    deadline_time: "2021-05-23T13:30:00Z",
    is_previous: false,
    is_current: false,
    is_next: false,
  },
  {
    id: 38,
    deadline_time: "2021-05-23T13:30:00Z",
    is_previous: false,
    is_current: false,
    is_next: false,
  },
];

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
