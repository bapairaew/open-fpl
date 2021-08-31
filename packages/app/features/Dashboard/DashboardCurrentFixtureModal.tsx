import {
  Badge,
  Box,
  Drawer,
  DrawerBody,
  DrawerCloseButton,
  DrawerContent,
  DrawerHeader,
  DrawerOverlay,
  Flex,
  HStack,
  Icon,
  Link as A,
  Text,
  VStack,
} from "@chakra-ui/react";
import DashboardFixturePlayerStat from "@open-fpl/app/features/Dashboard/DashboardFixturePlayerStat";
import {
  DashboardFixture,
  FixturePlayerStat,
} from "@open-fpl/app/features/Dashboard/dashboardTypes";
import { IoOpenOutline } from "react-icons/io5";

const DashboardCurrentFixtureModal = ({
  isOpen,
  onClose,
  fixture,
  live = false,
  minutes,
  homePlayers,
  awayPlayers,
  homeXG,
  awayXG,
  understatId,
}: {
  isOpen: boolean;
  onClose: () => void;
  fixture: DashboardFixture;
  live?: boolean;
  minutes?: number;
  homeXG?: string | null;
  awayXG?: string | null;
  understatId?: string | null;
  homePlayers: FixturePlayerStat[];
  awayPlayers: FixturePlayerStat[];
}) => {
  const isPicked = [...homePlayers, ...awayPlayers].some((p) => p.picked);
  return (
    <Drawer size="lg" isOpen={isOpen} onClose={onClose}>
      <DrawerOverlay />
      <DrawerContent>
        <DrawerHeader />
        <DrawerCloseButton />
        <DrawerBody pt={4} px={0}>
          <Flex
            my={4}
            flexGrow={1}
            width="100%"
            alignItems="center"
            justifyContent="space-around"
            aria-label="fixture results"
          >
            <Box textAlign="center" aria-label="home team">
              <Box
                py={1}
                px={2}
                fontWeight="black"
                layerStyle={`fpl-team-${fixture.team_h?.short_name}`}
                aria-label="team name"
              >
                {fixture.team_h?.short_name}
              </Box>
              <Box my={4} fontWeight="black" fontSize="6xl" aria-label="score">
                {fixture.team_h_score ?? 0}
              </Box>
              {homeXG && (
                <Box layerStyle="subtitle" my={4} aria-label="expected score">
                  xG: {homeXG}
                </Box>
              )}
            </Box>
            <VStack mx={2} textAlign="center" aria-label="fixture status">
              {live && <Badge colorScheme="red">Live</Badge>}
              {minutes !== undefined && (
                <Box aria-label="fixture minutes" layerStyle="subtitle">
                  {minutes}"
                </Box>
              )}
              {isPicked && (
                <Badge aria-label="there are players in your team playing in this match">
                  Picked
                </Badge>
              )}
            </VStack>
            <Box textAlign="center" aria-label="away team">
              <Box
                py={1}
                px={2}
                fontWeight="black"
                layerStyle={`fpl-team-${fixture.team_a?.short_name}`}
                aria-label="team name"
              >
                {fixture.team_a?.short_name}
              </Box>
              <Box my={4} fontSize="6xl" fontWeight="black" aria-label="score">
                {fixture.team_a_score ?? 0}
              </Box>
              {awayXG && (
                <Box layerStyle="subtitle" my={4} aria-label="expected score">
                  xG: {awayXG}
                </Box>
              )}
            </Box>
          </Flex>
          {understatId && (
            <Flex py={4} justifyContent="center">
              <A
                isExternal
                textDecoration="underline"
                href={`https://understat.com/match/${understatId}`}
              >
                Open in Understat <Icon as={IoOpenOutline} />
              </A>
            </Flex>
          )}
          <Flex
            px={{ base: 1, sm: 4 }}
            my={4}
            flexGrow={1}
            width="100%"
            alignItems="flex-start"
            justifyContent="space-around"
            fontSize="sm"
            aria-label="players statistics"
            role="list"
          >
            <Box flexBasis="50%" aria-label="home team">
              <HStack
                ml={0.5}
                spacing={1}
                alignItems="center"
                fontSize="xs"
                layerStyle="subtitle"
              >
                <Text
                  as="span"
                  width={{ base: "auto", sm: "25px" }}
                  noOfLines={1}
                  textAlign="right"
                >
                  BPS
                </Text>
                <Text
                  as="span"
                  width={{ base: "auto", sm: "100px" }}
                  noOfLines={1}
                >
                  Name
                </Text>
                <Box display={{ base: "block", sm: "none" }}>·</Box>
                <Text as="span" noOfLines={1} textAlign="right">
                  Points
                </Text>
              </HStack>
              {homePlayers.map((s) => (
                <DashboardFixturePlayerStat
                  key={s.player.id}
                  role="listitem"
                  playerStat={s}
                  align="left"
                  showBPS
                  fixedSizeOnDesktop
                />
              ))}
            </Box>
            <Box flexBasis="50%" aria-label="away team">
              <HStack
                ml={0.5}
                spacing={1}
                alignItems="center"
                fontSize="xs"
                layerStyle="subtitle"
                justifyContent="flex-end"
              >
                <Text as="span" noOfLines={1} textAlign="right">
                  Points
                </Text>
                <Box display={{ base: "block", sm: "none" }}>·</Box>
                <Text
                  as="span"
                  width={{ base: "auto", sm: "100px" }}
                  noOfLines={1}
                  textAlign="right"
                >
                  Name
                </Text>
                <Text
                  as="span"
                  width={{ base: "auto", sm: "25px" }}
                  noOfLines={1}
                  textAlign="right"
                >
                  BPS
                </Text>
              </HStack>
              {awayPlayers.map((s) => (
                <DashboardFixturePlayerStat
                  key={s.player.id}
                  role="listitem"
                  playerStat={s}
                  align="right"
                  showBPS
                  fixedSizeOnDesktop
                />
              ))}
            </Box>
          </Flex>
        </DrawerBody>
      </DrawerContent>
    </Drawer>
  );
};

export default DashboardCurrentFixtureModal;
