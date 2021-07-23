import {
  Box,
  Flex,
  HStack,
  Icon,
  IconButton,
  Menu,
  MenuButton,
  MenuItem,
  MenuList,
  Portal,
  useDisclosure,
} from "@chakra-ui/react";
import GameweekChanges from "@open-fpl/app/features/TeamPlanner/GameweekChanges";
import {
  Change,
  GameweekData,
  InvalidChange,
} from "@open-fpl/app/features/TeamPlanner/teamPlannerTypes";
import dynamic from "next/dynamic";
import { useMemo } from "react";
import { IoEllipsisVerticalOutline } from "react-icons/io5";
import AutoSizer from "react-virtualized-auto-sizer";

const TeamSummaryModal = dynamic(
  () => import("@open-fpl/app/features/TeamPlanner/TeamSummaryModal")
);

const ChangeLog = ({
  changes,
  currentGameweek,
  invalidChanges,
  gameweekDataList,
  onRemove,
  onMoveToGameweek,
}: {
  changes: Change[];
  currentGameweek: number;
  invalidChanges: InvalidChange[];
  gameweekDataList: GameweekData[];
  onRemove: (change: Change) => void;
  onMoveToGameweek: (gameweek: number) => void;
}) => {
  const groupedChanges = useMemo(() => {
    const reversedChanges = [...changes].reverse(); // Latest changes within the same gameweek should be shown first
    return reversedChanges.reduce((group, change) => {
      if (group[change.gameweek]) {
        group[change.gameweek].push(change);
      } else {
        group[change.gameweek] = [change];
      }
      return group;
    }, {} as Record<number, Change[]>);
  }, [changes]);

  const { isOpen, onClose, onOpen } = useDisclosure();

  return (
    <>
      {isOpen && (
        <TeamSummaryModal
          isOpen={isOpen}
          onClose={onClose}
          gameweekDataList={gameweekDataList}
          groupedChanges={groupedChanges}
        />
      )}
      <Box height="50px" borderBottomWidth={1}>
        {changes.length === 0 ? (
          <Flex px={4} height="100%" alignItems="center" color="gray.600">
            Click on a player below to make a team change
          </Flex>
        ) : (
          <AutoSizer>
            {({ height, width }) => (
              <HStack height={`${height}px`} width={`${width}px`} spacing={0}>
                <Box p="2px" height="100%">
                  <Menu isLazy>
                    {({ isOpen }) => (
                      <>
                        <MenuButton
                          as={IconButton}
                          height="100%"
                          borderRadius="none"
                          variant="ghost"
                          aria-label="options"
                          icon={<Icon as={IoEllipsisVerticalOutline} />}
                        />
                        {isOpen && (
                          <Portal>
                            <MenuList zIndex="popover">
                              <MenuItem onClick={onOpen}>View summary</MenuItem>
                            </MenuList>
                          </Portal>
                        )}
                      </>
                    )}
                  </Menu>
                </Box>
                <HStack
                  height={`${height}px`}
                  overflowX="auto"
                  overflowY="hidden"
                  spacing={0}
                >
                  {Object.keys(groupedChanges).map((gameweek) => {
                    return (
                      <GameweekChanges
                        key={gameweek}
                        height={height}
                        gameweek={+gameweek}
                        currentGameweek={currentGameweek}
                        invalidChanges={invalidChanges}
                        changes={groupedChanges[+gameweek]}
                        onRemove={onRemove}
                        onMoveToGameweek={onMoveToGameweek}
                      />
                    );
                  })}
                </HStack>
              </HStack>
            )}
          </AutoSizer>
        )}
      </Box>
    </>
  );
};

export default ChangeLog;
