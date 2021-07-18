import { Box, Button, Flex, Heading } from "@chakra-ui/react";
import TeamChange from "@open-fpl/app/features/TeamPlanner/TeamChange";
import {
  Change,
  InvalidChange,
} from "@open-fpl/app/features/TeamPlanner/teamPlannerTypes";
import { Fragment } from "react";

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
        bg="white"
        zIndex="sticky"
        textAlign="center"
        alignItems="center"
        p="2px"
        alignSelf="flex-start"
        height={`${height - 1}px`}
        borderRightWidth={1}
        borderLeftWidth={1}
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
          <Fragment key={index}>
            <Box borderRightWidth={1} height="100%">
              <TeamChange
                change={change}
                variant={variant}
                errorLabel={invalidity?.message}
                onRemoveClick={() => onRemove(change)}
              />
            </Box>
            <Box height="100%" px="1px" />
          </Fragment>
        );
      })}
    </>
  );
};

export default GameweekChanges;
