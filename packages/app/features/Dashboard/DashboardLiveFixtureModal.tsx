import {
  Box,
  Drawer,
  DrawerBody,
  DrawerCloseButton,
  DrawerContent,
  DrawerHeader,
  DrawerOverlay,
  Flex,
  HStack,
  Text,
} from "@chakra-ui/react";
import {
  DashboardFixture,
  FixturePlayerStat,
} from "@open-fpl/app/features/Dashboard/dashboardTypes";
import DashboardFixturePlayerStat from "@open-fpl/app/features/Dashboard/DashboardFixturePlayerStat";

const DashboardLiveFixtureModal = ({
  isOpen,
  onClose,
  fixture,
  minutes,
  homePlayers,
  awayPlayers,
}: {
  isOpen: boolean;
  onClose: () => void;
  fixture: DashboardFixture;
  minutes: number;
  homePlayers: FixturePlayerStat[];
  awayPlayers: FixturePlayerStat[];
}) => {
  return (
    <Drawer size="lg" isOpen={isOpen} onClose={onClose}>
      <DrawerOverlay />
      <DrawerContent>
        <DrawerHeader />
        <DrawerCloseButton />
        <DrawerBody pt={4} px={0}>
          <Flex
            my={2}
            flexGrow={1}
            width="100%"
            alignItems="center"
            justifyContent="space-around"
          >
            <Box fontWeight="black" textAlign="center">
              <Box
                py={1}
                px={2}
                layerStyle={`fpl-team-${fixture.team_h?.short_name}`}
              >
                {fixture.team_h?.short_name}
              </Box>
              <Box my={4} fontSize="6xl">
                {fixture.team_h_score ?? 0}
              </Box>
            </Box>
            <Box mx={2} layerStyle="subtitle">
              {minutes}"
            </Box>
            <Box fontWeight="black" textAlign="center">
              <Box
                py={1}
                px={2}
                layerStyle={`fpl-team-${fixture.team_a?.short_name}`}
              >
                {fixture.team_a?.short_name}
              </Box>
              <Box my={4} fontSize="6xl">
                {fixture.team_a_score ?? 0}
              </Box>
            </Box>
          </Flex>
          <Flex
            px={{ base: 1, sm: 4 }}
            my={2}
            flexGrow={1}
            width="100%"
            alignItems="center"
            justifyContent="space-around"
            fontSize="sm"
          >
            <Box flexBasis="50%">
              <HStack
                ml={0.5}
                spacing={1}
                alignItems="center"
                fontSize="xs"
                layerStyle="subtitle"
              >
                <Text
                  width={{ base: "auto", sm: "25px" }}
                  noOfLines={1}
                  textAlign="right"
                >
                  BPS
                </Text>
                <Text width={{ base: "auto", sm: "100px" }} noOfLines={1}>
                  Name
                </Text>
                <Text noOfLines={1} textAlign="right">
                  Points
                </Text>
              </HStack>
              {homePlayers.map((s) => (
                <DashboardFixturePlayerStat
                  key={s.player.id}
                  playerStat={s}
                  align="left"
                  showBPS
                  fixedSizeOnDesktop
                />
              ))}
            </Box>
            <Box flexBasis="50%">
              <HStack
                ml={0.5}
                spacing={1}
                alignItems="center"
                fontSize="xs"
                layerStyle="subtitle"
                justifyContent="flex-end"
              >
                <Text noOfLines={1} textAlign="right">
                  Points
                </Text>
                <Text
                  width={{ base: "auto", sm: "100px" }}
                  noOfLines={1}
                  textAlign="right"
                >
                  Name
                </Text>
                <Text
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

export default DashboardLiveFixtureModal;
