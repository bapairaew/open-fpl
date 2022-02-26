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
// import { AnalyticsTeamPlanner } from "@open-fpl/app/features/Analytics/analyticsTypes";
import GameweekChanges from "@open-fpl/app/features/TeamPlanner/GameweekChanges";
import {
  Change,
  GameweekData,
  InvalidChange,
} from "@open-fpl/app/features/TeamPlanner/teamPlannerTypes";
// import { usePlausible } from "next-plausible";
import dynamic from "next/dynamic";
import { useMemo } from "react";
import { IoEllipsisVerticalOutline } from "react-icons/io5";
import AutoSizer from "react-virtualized-auto-sizer";

const TeamSummaryModal = dynamic(
  () => import("@open-fpl/app/features/TeamPlanner/TeamSummaryModal")
);

const TeamChangelog = ({
  changes,
  nextGameweekId,
  planningGameweek,
  invalidChanges,
  gameweekDataList,
  onRemove,
  onMoveToGameweek,
}: {
  changes: Change[];
  nextGameweekId: number;
  planningGameweek: number;
  invalidChanges: InvalidChange[];
  gameweekDataList: GameweekData[];
  onRemove: (changes: Change[]) => void;
  onMoveToGameweek: (gameweek: number) => void;
}) => {
  // const plausible = usePlausible<AnalyticsTeamPlanner>();

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

  const handleViewSummary = () => {
    onOpen();
    // plausible("team-planner-changelog-open-summary");
  };

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
      <Box
        as="section"
        aria-label="team changelog"
        height="50px"
        borderBottomWidth={1}
      >
        {changes.length === 0 ? (
          <Flex px={4} height="100%" alignItems="center" layerStyle="subtitle">
            Click on a player below to make a team change
          </Flex>
        ) : (
          <AutoSizer>
            {({ height, width }) => (
              <HStack height={`${height}px`} width={`${width}px`} spacing={0}>
                <Box
                  height="calc(100% - 2px)"
                  layerStyle="sticky"
                  borderRightWidth={1}
                >
                  <Menu isLazy>
                    {({ isOpen }) => (
                      <>
                        <MenuButton
                          as={IconButton}
                          height="100%"
                          size="sm"
                          borderRadius="none"
                          variant="ghost"
                          aria-label="open team changelog menu"
                          icon={<Icon as={IoEllipsisVerticalOutline} />}
                        />
                        {isOpen && (
                          <Portal>
                            <MenuList zIndex="popover">
                              <MenuItem onClick={handleViewSummary}>
                                View summary
                              </MenuItem>
                            </MenuList>
                          </Portal>
                        )}
                      </>
                    )}
                  </Menu>
                </Box>
                <HStack
                  as="section"
                  aria-label="gameweeks changes"
                  height={`${height}px`}
                  overflowX="auto"
                  overflowY="hidden"
                  alignItems="stretch"
                  spacing={0}
                >
                  {Object.keys(groupedChanges).map((gameweek) => {
                    return (
                      <GameweekChanges
                        key={gameweek}
                        height={height}
                        gameweek={+gameweek}
                        nextGameweekId={nextGameweekId}
                        planningGameweek={planningGameweek}
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

export default TeamChangelog;
