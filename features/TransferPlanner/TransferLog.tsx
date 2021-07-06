import { Box, Button, Flex, Heading, HStack } from "@chakra-ui/react";
import { useMemo } from "react";
import AutoSizer from "react-virtualized-auto-sizer";
import TransferChange from "~/features/TransferPlanner/TransferChange";
import {
  Change,
  InvalidChange,
} from "~/features/TransferPlanner/transferPlannerTypes";

const GameweekChanges = ({
  height,
  gameweek,
  currentGameweek,
  invalidChanges,
  changes,
  onRemove,
  onMoveToGameweek,
}: {
  height: number;
  gameweek: number;
  currentGameweek: number;
  invalidChanges: InvalidChange[];
  changes: Change[];
  onRemove: (change: Change) => void;
  onMoveToGameweek: (gameweek: number) => void;
}) => {
  return (
    <>
      <Flex
        position="sticky"
        left={0}
        p="2px"
        bg="white"
        zIndex="sticky"
        textAlign="center"
        alignItems="center"
        height={`${height - 2}px`}
        borderRightWidth={1}
      >
        <Button
          variant="unstyled"
          width="80px"
          height="100%"
          borderRadius="none"
          onClick={() => onMoveToGameweek(gameweek)}
        >
          <Heading size="xs">GW {gameweek}</Heading>
        </Button>
      </Flex>
      {changes.map((change, index) => {
        const isOutdated = change.gameweek < currentGameweek;
        const invalidity = invalidChanges.find(
          (c) => c.change.id === change.id
        );
        const variant = isOutdated
          ? "outdated"
          : invalidity
          ? "invalid"
          : "default";
        return (
          <Box key={index} borderRightWidth={1} height="100%">
            <TransferChange
              variant={variant}
              errorLabel={invalidity?.message}
              change={change}
              onRemoveClick={() => onRemove(change)}
            />
          </Box>
        );
      })}
    </>
  );
};

const TransferLog = ({
  changes,
  currentGameweek,
  invalidChanges,
  onRemove,
  onMoveToGameweek,
}: {
  changes: Change[];
  currentGameweek: number;
  invalidChanges: InvalidChange[];
  onRemove: (change: Change) => void;
  onMoveToGameweek: (gameweek: number) => void;
}) => {
  const groupedChanges = useMemo(() => {
    const reversedChanges = [...changes].reverse();
    return reversedChanges.reduce((group, change) => {
      if (group[change.gameweek]) {
        group[change.gameweek].push(change);
      } else {
        group[change.gameweek] = [change];
      }
      return group;
    }, {} as Record<number, Change[]>);
  }, [changes]);

  const reversedGroupedKeys = useMemo(
    () => Object.keys(groupedChanges).reverse(),
    [groupedChanges]
  );

  return (
    <Box height="50px" borderBottomWidth={1}>
      {changes.length === 0 ? (
        <Flex px={4} height="100%" alignItems="center" color="gray.600">
          Click on a player below to make a transfer
        </Flex>
      ) : (
        <AutoSizer>
          {({ height, width }) => (
            <HStack
              height={`${height}px`}
              width={`${width}px`}
              overflowX="auto"
              overflowY="hidden"
              spacing={0}
            >
              {reversedGroupedKeys.map((gameweek) => {
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
          )}
        </AutoSizer>
      )}
    </Box>
  );
};

export default TransferLog;
