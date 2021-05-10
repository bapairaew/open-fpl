import { Box, Flex, Heading, Link as A, Text } from "@theme-ui/components";
import { NextSeo } from "next-seo";
import Link from "next/link";
import { AnnotationCalloutRect } from "react-annotation";
import PlayerCard from "~/components/PlayerCard";
import PlayerSearchBar from "~/components/PlayerSearchBar";

const player = {
  id: 302,
  name: "Bruno Miguel Borges Fernandes",
  web_name: "Fernandes",
  news: "",
  status: "a",
  now_cost: 115,
  photo: "141746.jpg",
  chance_of_playing_next_round: null,
  chance_of_playing_this_round: null,
  total_points: 221,
  element_type: {
    singular_name_short: "MID",
  },
  team: {
    id: 13,
    short_name: "MUN",
    name: "Man Utd",
    strength_overall_home: 1250,
    strength_overall_away: 1320,
    strength_attack_home: 1250,
    strength_attack_away: 1280,
    strength_defence_home: 1240,
    strength_defence_away: 1310,
    color_codes: {
      team: "Manchester United",
      background: "#dc1f29",
      text: "#fae935",
      highlight: "#000",
    },
  },
  previous_gameweeks: [
    {
      opponent_team_short_name: "WHU",
      was_home: true,
      kickoff_time: "2021-03-14T19:15:00Z",
      total_points: 3,
      bps: 14,
      minutes: 90,
    },
    {
      opponent_team_short_name: "BHA",
      was_home: true,
      kickoff_time: "2021-04-04T18:30:00Z",
      total_points: 5,
      bps: 24,
      minutes: 90,
    },
    {
      opponent_team_short_name: "TOT",
      was_home: false,
      kickoff_time: "2021-04-11T15:30:00Z",
      total_points: 2,
      bps: 12,
      minutes: 89,
    },
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
  ],
  next_gameweeks: [
    {
      opponent: "AVL",
      is_home: false,
      event: 35,
      finished: false,
      difficulty: 3,
    },
    {
      opponent: "LEI",
      is_home: true,
      event: 35,
      finished: false,
      difficulty: 4,
    },
    {
      opponent: "LIV",
      is_home: true,
      event: 35,
      finished: false,
      difficulty: 4,
    },
    {
      opponent: "FUL",
      is_home: true,
      event: 37,
      finished: false,
      difficulty: 2,
    },
    {
      opponent: "WOL",
      is_home: false,
      event: 38,
      finished: false,
      difficulty: 3,
    },
  ],
  stats: {
    matches: [
      {
        opponent_short_title: "WHU",
        is_home: true,
        match_xgi: 0.8615838289260864,
        match_xga: 0.463737,
      },
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
    ],
    season_xgi: 0.8002029773105079,
    season_xga: 1.0863365454545455,
  },
};

const gameweeks = [
  {
    id: 35,
    deadline_time: "2021-05-23T13:30:00Z",
    is_previous: false,
    is_current: true,
    is_next: false,
  },
  {
    id: 36,
    deadline_time: "2021-05-23T13:30:00Z",
    is_previous: false,
    is_current: false,
    is_next: true,
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

function HelpPage() {
  return (
    <>
      <NextSeo title="How to use | Open FPL" />
      <Box mt={2} mb={4} py={2} px={4}>
        <Heading as="h1" sx={{ fontWeight: "display" }} my={4}>
          Player Explorer
        </Heading>
        <Text my={4} as="p">
          This is how to use{" "}
          <Link href="/" passHref>
            <A>Player Explorer</A>
          </Link>{" "}
          page.
        </Text>
        <Heading as="h2" sx={{ fontWeight: "display" }} my={4}>
          Player Card
        </Heading>
        <Text my={4} as="p">
          Below is the anatomy of a player card.
        </Text>
        <Flex
          mx="auto"
          sx={{
            justifyContent: "center",
            alignItems: "center",
            height: 600,
            width: 800,
            position: "relative",
          }}
        >
          <Box sx={{ width: 400 }}>
            <PlayerCard player={player} gameweeks={gameweeks} />
          </Box>
          <Box as="svg" sx={{ width: 800, height: 600, position: "absolute" }}>
            <AnnotationCalloutRect
              x={255}
              y={172}
              dx={-26}
              dy={-57}
              note={{
                title: "Team",
              }}
              subject={{ width: -54, height: 47 }}
            />
            <AnnotationCalloutRect
              x={255}
              y={172}
              dx={55}
              dy={-70}
              note={{
                title: "Player name",
              }}
              subject={{ width: 241, height: 47 }}
            />
            <AnnotationCalloutRect
              x={461}
              y={200}
              dx={-1}
              dy={-54}
              note={{
                title: "FPL ID",
              }}
              subject={{ width: 36, height: 19 }}
            />
            <AnnotationCalloutRect
              x={542}
              y={172}
              dx={-24}
              dy={-100}
              note={{
                title: "Position",
              }}
              subject={{ width: -46, height: 47 }}
            />
            <AnnotationCalloutRect
              x={542}
              y={172}
              dx={79}
              dy={-64}
              note={{
                title: "Cost",
              }}
              subject={{ width: 58, height: 47 }}
            />
            <AnnotationCalloutRect
              x={200}
              y={219}
              dx={-52}
              dy={24}
              note={{
                title: "Next fixtures",
              }}
              subject={{ width: 400, height: 63 }}
            />
            <AnnotationCalloutRect
              x={200}
              y={282}
              dx={-52}
              dy={24}
              note={{
                title: "Previous fixtures FPL points",
              }}
              subject={{ width: 400, height: 63 }}
            />
            <AnnotationCalloutRect
              x={200}
              y={366}
              dx={470}
              dy={-44}
              note={{
                title: "Previous fixtures xGI",
              }}
              subject={{ width: 400, height: 30 }}
            />
            <AnnotationCalloutRect
              x={200}
              y={396}
              dx={453}
              dy={79}
              note={{
                title: "Previous fixtures xGC",
              }}
              subject={{ width: 400, height: 30 }}
            />
          </Box>
        </Flex>
        <Heading as="h2" sx={{ fontWeight: "display" }} my={3}>
          Player Search Bar
        </Heading>
        <Heading as="h3" sx={{ fontWeight: "display" }} my={3}>
          Filtering
        </Heading>
        <Text mt={4} mb={2} as="p">
          Player Search Bar supports free text search which will do fuzzy search
          on players' full name hence if you typed "Paul", the search results
          would show (Paul) Pogba and (Paul) Dummett.
        </Text>
        <Box sx={{ pointerEvents: "none" }}>
          <PlayerSearchBar initialSeachQuery="Paul" />
        </Box>
        <Text mt={4} mb={2} as="p">
          It also supports search query syntax like when you do email search.
          For example, if you want to specifically find a player based on their
          name FPL page you can use field search <code>name</code> like shown
          below:
        </Text>
        <Box sx={{ pointerEvents: "none" }}>
          <PlayerSearchBar initialSeachQuery="name:Pogba" />
        </Box>
        <Box mt={4} mb={2}>
          Currently, it supports the following fields:
          <ul>
            <li>
              <Text>
                <code>id</code> - FPL ID
              </Text>
              <Box sx={{ pointerEvents: "none" }}>
                <PlayerSearchBar initialSeachQuery="id:296" />
              </Box>
            </li>
            <li>
              <Text>
                <code>name</code> - FPL web name
              </Text>
              <Box sx={{ pointerEvents: "none" }}>
                <PlayerSearchBar initialSeachQuery="name:Pogba" />
              </Box>
            </li>
            <li>
              <Text>
                <code>cost</code> - FPL player's cost range
              </Text>
              <Box sx={{ pointerEvents: "none" }}>
                <PlayerSearchBar initialSeachQuery="price:4-10" />
              </Box>
            </li>
            <li>
              <Text>
                <code>position</code> - FPL positon (FWD, MID, DEF, GKP)
              </Text>
              <Box sx={{ pointerEvents: "none" }}>
                <PlayerSearchBar initialSeachQuery="position:MID" />
              </Box>
            </li>
            <li>
              <Text>
                <code>team</code> - FPL short team name (e.g. MUN, LIV, MCI)
              </Text>
              <Box sx={{ pointerEvents: "none" }}>
                <PlayerSearchBar initialSeachQuery="team:MUN" />
              </Box>
            </li>
          </ul>
        </Box>
        <Text mt={4} mb={2} as="p">
          You can also do field keyword combination to expand your search
          results, for example, if you want to search for players from
          Manchester United OR Liverpool you can do the following:
        </Text>
        <Box sx={{ pointerEvents: "none" }}>
          <PlayerSearchBar initialSeachQuery="name:MUN,LIV" />
        </Box>
        <Text mt={4} mb={2} as="p">
          Or if you want to narrow down your search result you could append
          anoter field search query, for example, the following will show
          Manchester United midfield players
        </Text>
        <Box sx={{ pointerEvents: "none" }}>
          <PlayerSearchBar initialSeachQuery="team:MUN position:MID" />
        </Box>
        <Text mt={4} mb={2} as="p">
          You can also exclude some search results use exclusion prefix `-` like
          shown below how to exclude Pogba from search results. Please also note
          that range search (e.g. cost) DOES NOT support exclusion yet.
        </Text>
        <Box sx={{ pointerEvents: "none" }}>
          <PlayerSearchBar initialSeachQuery="team:MUN position:MID -name:Pogba" />
        </Box>
        <Heading as="h3" sx={{ fontWeight: "display" }} my={3}>
          Sorting
        </Heading>
        <Text mt={4} mb={2} as="p">
          You can sort the results by using the dropdown besides the search text
          box. The default is "Best Fixtures" which is calculated from FPL match
          difficulty.
        </Text>
      </Box>
    </>
  );
}

export default HelpPage;
