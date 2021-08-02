import {
  Box,
  Divider,
  Drawer,
  DrawerBody,
  DrawerCloseButton,
  DrawerContent,
  DrawerHeader,
  DrawerOverlay,
  Flex,
  Heading,
  HStack,
  Text,
  VStack,
  useColorMode,
} from "@chakra-ui/react";
import { Fragment } from "react";
import { positionColorCodes } from "@open-fpl/data/features/RemoteData/fplColors";
import TeamChange from "@open-fpl/app/features/TeamPlanner/TeamChange";
import { makeTeamGroupObject } from "@open-fpl/app/features/TeamPlanner/teamGroupObject";
import {
  Change,
  FullChangePlayer,
  GameweekData,
} from "@open-fpl/app/features/TeamPlanner/teamPlannerTypes";

const PlayerRow = ({
  player,
  isOnBench = false,
}: {
  player: FullChangePlayer;
  isOnBench?: boolean;
}) => {
  const { colorMode } = useColorMode();
  return (
    <>
      <Divider />
      <Flex
        bgColor={
          isOnBench ? (colorMode ? "whiteAlpha.50" : "gray.50") : undefined
        }
        color={
          isOnBench ? (colorMode ? "whiteAlpha.500" : "gray.500") : undefined
        }
        fontSize="sm"
        width="160px"
      >
        <Box width="5px">
          <Flex
            borderRightWidth={1}
            width="100%"
            height="100%"
            bgColor={
              positionColorCodes(colorMode)[
                player.element_type.singular_name_short
              ].background
            }
          />
        </Box>
        <Flex px={2} py={1} flexGrow={1}>
          <Text noOfLines={1}>{player.web_name}</Text>
        </Flex>
        {(player.pick.is_captain || player.pick.is_vice_captain) && (
          <Flex
            width="40px"
            px={2}
            justifyContent="center"
            alignItems="center"
            borderLeftWidth={1}
            bgColor={
              player.pick.is_captain
                ? colorMode === "dark"
                  ? "brand.200"
                  : "brand.500"
                : undefined
            }
            color={
              player.pick.is_captain
                ? colorMode === "dark"
                  ? "gray.700"
                  : "white"
                : colorMode === "dark"
                ? "brand.200"
                : "brand.500"
            }
            fontWeight="black"
          >
            {player.pick.is_captain
              ? "C"
              : player.pick.is_vice_captain
              ? "V"
              : null}
          </Flex>
        )}
      </Flex>
    </>
  );
};

const TeamSummaryModal = ({
  isOpen,
  onClose,
  gameweekDataList,
  groupedChanges,
}: {
  isOpen: boolean;
  onClose: () => void;
  gameweekDataList: GameweekData[];
  groupedChanges: Record<number, Change[]>;
}) => {
  const latestGameweekWithChanges = Math.max(
    ...Object.keys(groupedChanges).map((x) => +x)
  );

  const gameweeksToDisplay = gameweekDataList.filter(
    (g) => g.gameweek <= latestGameweekWithChanges
  );

  return (
    <Drawer size="lg" placement="bottom" isOpen={isOpen} onClose={onClose}>
      <DrawerOverlay />
      <DrawerContent>
        <DrawerCloseButton />
        <DrawerHeader fontWeight="black">Summary</DrawerHeader>
        <DrawerBody>
          <HStack spacing={0} mb={4}>
            {gameweeksToDisplay.map((gameweekData, index) => {
              const { GKP, DEF, MID, FWD, bench } = makeTeamGroupObject(
                gameweekData.team
              );
              return (
                <Fragment key={gameweekData.gameweek}>
                  {index !== 0 && (
                    <Box>
                      <Divider width="20px" />
                    </Box>
                  )}
                  {gameweekData.gameweek > 1 && (
                    <>
                      <Box borderWidth={1}>
                        {groupedChanges[gameweekData.gameweek]?.map(
                          (change) => (
                            <Box key={change.id} height="50px">
                              <TeamChange change={change} />
                              <Divider />
                            </Box>
                          )
                        )}
                      </Box>
                      <Box>
                        <Divider width="20px" />
                      </Box>
                    </>
                  )}
                  <VStack spacing={0} borderWidth={1}>
                    <Heading size="xs" my={2}>
                      Gameweek {gameweekData.gameweek}
                    </Heading>
                    {GKP.map((player) => {
                      return <PlayerRow key={player.id} player={player} />;
                    })}
                    {DEF.map((player) => {
                      return <PlayerRow key={player.id} player={player} />;
                    })}
                    {MID.map((player) => {
                      return <PlayerRow key={player.id} player={player} />;
                    })}
                    {FWD.map((player) => {
                      return <PlayerRow key={player.id} player={player} />;
                    })}
                    {bench.map((player) => {
                      return (
                        <PlayerRow key={player.id} player={player} isOnBench />
                      );
                    })}
                  </VStack>
                </Fragment>
              );
            })}
            <Box>
              {/* Give buffer space on the far right */}
              <Box width="20px" height="1px" />
            </Box>
          </HStack>
        </DrawerBody>
      </DrawerContent>
    </Drawer>
  );
};

export default TeamSummaryModal;
