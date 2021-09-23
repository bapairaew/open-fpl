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
} from "@chakra-ui/react";
import TeamChange from "@open-fpl/app/features/TeamPlanner/TeamChange";
import { makeTeamGroupObject } from "@open-fpl/app/features/TeamPlanner/teamGroupObject";
import {
  Change,
  FullChangePlayer,
  GameweekData,
} from "@open-fpl/app/features/TeamPlanner/teamPlannerTypes";
import { Fragment } from "react";

const PlayerRow = ({
  player,
  isOnBench = false,
}: {
  player: FullChangePlayer;
  isOnBench?: boolean;
}) => {
  return (
    <>
      <Divider />
      <Flex role="listitem" fontSize="sm" width="160px">
        <Box width="5px">
          <Flex
            borderRightWidth={1}
            width="100%"
            height="100%"
            layerStyle={`fpl-position-${player.element_type.singular_name_short}`}
            aria-label={player.element_type.singular_name_short}
          />
        </Box>
        <Flex px={2} py={1} flexGrow={1}>
          <Text
            as="span"
            noOfLines={1}
            fontWeight={isOnBench ? "normal" : "bold"}
            opacity={isOnBench ? 0.7 : 1}
            aria-label={player.web_name}
          >
            {player.web_name}
          </Text>
        </Flex>
        {(player.pick.is_captain || player.pick.is_vice_captain) && (
          <Flex
            width="40px"
            px={2}
            justifyContent="center"
            alignItems="center"
            borderLeftWidth={1}
            layerStyle="brandSolid"
            fontWeight="black"
            aria-label={player.pick.is_captain ? "captain" : "vice-captain"}
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
  const allGamweekChanges = Object.keys(groupedChanges).map((x) => +x);
  const earliestGameweekWithChanges = Math.min(...allGamweekChanges);
  const latestGameweekWithChanges = Math.max(...allGamweekChanges);

  const gameweeksToDisplay = gameweekDataList.filter(
    (g) =>
      g.gameweek >= earliestGameweekWithChanges - 1 &&
      g.gameweek <= latestGameweekWithChanges
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
                      <Box
                        as="section"
                        aria-label={`gameweek ${gameweekData.gameweek} changes`}
                        role="list"
                        borderWidth={1}
                      >
                        {groupedChanges[gameweekData.gameweek]?.map(
                          (change) => (
                            <Box role="listitem" key={change.id} height="50px">
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
                  <VStack
                    as="section"
                    spacing={0}
                    borderWidth={1}
                    aria-labelledby={`team-summary-modal-header-${gameweekData.gameweek}`}
                  >
                    <Heading
                      size="xs"
                      my={2}
                      id={`team-summary-modal-header-${gameweekData.gameweek}`}
                    >
                      Gameweek {gameweekData.gameweek}
                    </Heading>
                    <VStack role="listitem" spacing={0}>
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
                          <PlayerRow
                            key={player.id}
                            player={player}
                            isOnBench
                          />
                        );
                      })}
                    </VStack>
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
