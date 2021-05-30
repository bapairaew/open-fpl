import {
  Box,
  Divider,
  Flex,
  Heading,
  HStack,
  Icon,
  IconButton,
  Text,
  VStack,
} from "@chakra-ui/react";
import { Fragment, useMemo } from "react";
import {
  IoArrowBackOutline,
  IoArrowForwardOutline,
  IoCloseOutline,
  IoSwapVerticalOutline,
} from "react-icons/io5";
import AutoSizer from "react-virtualized-auto-sizer";

const Change = ({ change }) => {
  const selectedColor = change.type === "swap" ? undefined : "red";
  const targetColor = change.type === "swap" ? undefined : "green";
  const SelectedIcon =
    change.type === "swap" ? IoSwapVerticalOutline : IoArrowForwardOutline;
  const TargetIcon =
    change.type === "swap" ? IoSwapVerticalOutline : IoArrowBackOutline;
  return (
    <VStack spacing={0} width="100px">
      <Text fontSize="xs" noOfLines={1}>
        <Icon as={SelectedIcon} mr={1} color={selectedColor} />
        {change.selectedPlayer?.web_name}
      </Text>
      <Text fontSize="xs" noOfLines={1}>
        <Icon as={TargetIcon} mr={1} color={targetColor} />
        {change.targetPlayer?.web_name}
      </Text>
    </VStack>
  );
};

const TransferLog = ({ changes, onRemove }) => {
  const groupedChanges = useMemo(() => {
    const reversedChanges = [...changes].reverse();
    return reversedChanges.reduce((group, change) => {
      if (group[change.gameweek]) {
        group[change.gameweek].push(change);
      } else {
        group[change.gameweek] = [change];
      }
      return group;
    }, {});
  }, [changes]);

  const reversedGroupedKeys = useMemo(
    () => Object.keys(groupedChanges).reverse(),
    [groupedChanges]
  );

  return (
    <Box height="50px" borderBottomWidth={1}>
      {changes.length === 0 ? (
        <Flex px={4} height="100%" alignItems="center" color="gray">
          Click on a player below to make a transfer
        </Flex>
      ) : (
        <AutoSizer>
          {({ height, width }) => (
            <HStack height={`${height}px`} width={`${width}px`} overflow="auto">
              {reversedGroupedKeys.map((gameweek) => {
                return (
                  <Fragment key={gameweek}>
                    <Flex
                      position="sticky"
                      left={0}
                      bg="white"
                      zIndex="sticky"
                      textAlign="center"
                      alignItems="center"
                      height={`${height - 2}px`}
                    >
                      <Heading size="xs" width="80px">
                        GW {gameweek}
                      </Heading>
                      <Divider orientation="vertical" />
                    </Flex>
                    {groupedChanges[gameweek].map((change, index) => (
                      <Fragment key={index}>
                        <HStack pl={1} spacing={0}>
                          <Change change={change} />
                          <IconButton
                            onClick={() => onRemove(change)}
                            variant="ghost"
                            size="xs"
                            aria-label="remove"
                            icon={<Icon as={IoCloseOutline} />}
                          />
                        </HStack>
                        <Divider orientation="vertical" />
                      </Fragment>
                    ))}
                  </Fragment>
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
