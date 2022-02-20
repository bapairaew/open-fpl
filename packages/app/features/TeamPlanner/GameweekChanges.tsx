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
  nextGameweekId,
  planningGameweek,
  invalidChanges,
  changes,
  onRemove,
  onMoveToGameweek,
}: {
  height: number;
  gameweek: number;
  nextGameweekId: number;
  planningGameweek: number;
  invalidChanges: InvalidChange[];
  changes: Change[];
  onRemove: (change: Change) => void;
  onMoveToGameweek: (gameweek: number) => void;
}) => {
  const isPlanningGameweek = planningGameweek === gameweek;
  return (
    <>
      <Flex
        position="sticky"
        left={0}
        p="2px"
        layerStyle={isPlanningGameweek ? "sticky" : "unhighlight"}
        zIndex="sticky"
        textAlign="center"
        alignItems="center"
        alignSelf="flex-start"
        height={`${height - 1}px`}
        borderRightWidth={1}
        borderLeftWidth={1}
      >
        <Button
          variant="unstyled"
          width={{ base: "60px", sm: "80px" }}
          height="100%"
          borderRadius="none"
          onClick={() => onMoveToGameweek(gameweek)}
        >
          <Heading
            as="span"
            size="xs"
            id={`changelog-gameweek-changes-${gameweek}`}
          >
            GW {gameweek}
          </Heading>
        </Button>
      </Flex>
      <Flex
        role="list"
        aria-labelledby={`changelog-gameweek-changes-${gameweek}`}
      >
        {changes.map((change, index) => {
          const isOutdated = change.gameweek < nextGameweekId;
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
              <Box
                role="listitem"
                borderRightWidth={1}
                height="calc(100% - 1px)"
                layerStyle={isPlanningGameweek ? "sticky" : "unhighlight"}
              >
                <TeamChange
                  change={change}
                  variant={variant}
                  errorLabel={invalidity?.message}
                  onRemoveClick={() => onRemove(change)}
                />
              </Box>
            </Fragment>
          );
        })}
      </Flex>
    </>
  );
};

export default GameweekChanges;
