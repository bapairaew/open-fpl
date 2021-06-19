import { Box, Flex, Heading, HStack } from "@chakra-ui/react";
import { useMemo } from "react";
import AutoSizer from "react-virtualized-auto-sizer";
import TransferChange from "~/features/TransferPlanner/TransferChange";
import {
  Change,
  FullChangePlayer,
  InvalidChange,
} from "~/features/TransferPlanner/transferPlannerTypes";

const GameweekChanges = ({
  height,
  gameweek,
  currentGameweek,
  invalidChanges,
  changes,
  onRemove,
}: {
  height: number;
  gameweek: string | number;
  currentGameweek: number;
  invalidChanges: InvalidChange<FullChangePlayer>[];
  changes: Change<FullChangePlayer>[];
  onRemove: (change: Change<FullChangePlayer>) => void;
}) => {
  return (
    <>
      <Flex
        position="sticky"
        left={0}
        bg="white"
        zIndex="sticky"
        textAlign="center"
        alignItems="center"
        height={`${height - 2}px`}
        borderRightWidth={1}
      >
        <Heading size="xs" width="80px">
          GW {gameweek}
        </Heading>
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
}: {
  changes: Change<FullChangePlayer>[];
  currentGameweek: number;
  invalidChanges: InvalidChange<FullChangePlayer>[];
  onRemove: (change: Change<FullChangePlayer>) => void;
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
    }, {} as Record<number, Change<FullChangePlayer>[]>);
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
              overflow="auto"
              spacing={0}
            >
              {reversedGroupedKeys.map((gameweek) => {
                return (
                  <GameweekChanges
                    key={gameweek}
                    height={height}
                    gameweek={gameweek}
                    currentGameweek={currentGameweek}
                    invalidChanges={invalidChanges}
                    onRemove={onRemove}
                    changes={groupedChanges[+gameweek]}
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
