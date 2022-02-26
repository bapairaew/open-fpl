import { Box, Button, Flex, Heading, Icon, IconButton } from "@chakra-ui/react";
import RemoveGameweekChangesModal from "@open-fpl/app/features/TeamPlanner/RemoveGameweekChangesModal";
import TeamChange from "@open-fpl/app/features/TeamPlanner/TeamChange";
import {
  Change,
  InvalidChange,
} from "@open-fpl/app/features/TeamPlanner/teamPlannerTypes";
import { Fragment, useState } from "react";
import {
  IoChevronBack,
  IoChevronForward,
  IoDiscOutline,
  IoTrashOutline,
} from "react-icons/io5";

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
  onRemove: (changes: Change[]) => void;
  onMoveToGameweek: (gameweek: number) => void;
}) => {
  const isPlanningGameweek = planningGameweek === gameweek;
  const chipUsed = changes.some((c) => c.type === "use-chip");
  const [isChangesExpanded, setIsChangesExpanded] = useState(true);
  const [isRemoveChangesOpened, setIsRemoveChangesOpened] = useState(false);
  const handleRemoveGameweekChanges = () => setIsRemoveChangesOpened(true);
  const handleConfirmRemoveGameweekChanges = () => {
    onRemove(changes);
    setIsRemoveChangesOpened(false);
  };

  return (
    <>
      <RemoveGameweekChangesModal
        gameweekId={gameweek}
        isOpen={isRemoveChangesOpened}
        onClose={() => setIsRemoveChangesOpened(false)}
        onConfirm={handleConfirmRemoveGameweekChanges}
      />
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
      >
        <IconButton
          size="xs"
          layerStyle="brand"
          aria-label={isChangesExpanded ? "minimize" : "expand"}
          variant="unstyled"
          height="100%"
          borderRadius="none"
          icon={<Icon as={IoTrashOutline} />}
          onClick={handleRemoveGameweekChanges}
        />
        <Button
          layerStyle="brand"
          variant="unstyled"
          width={{
            base: chipUsed ? "80px" : "60px",
            sm: chipUsed ? "100px" : "80px",
          }}
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
          {chipUsed && (
            <Icon
              aria-label="chip used"
              ml={2}
              as={IoDiscOutline}
              fontSize="xs"
            />
          )}
        </Button>
        <IconButton
          size="xs"
          layerStyle="brand"
          aria-label={isChangesExpanded ? "minimize" : "expand"}
          variant="unstyled"
          height="100%"
          borderRadius="none"
          icon={
            <Icon as={isChangesExpanded ? IoChevronBack : IoChevronForward} />
          }
          onClick={() => setIsChangesExpanded(!isChangesExpanded)}
        />
      </Flex>
      {!isChangesExpanded && (
        <>
          <Flex
            borderRightWidth={1}
            pl="2px"
            layerStyle={isPlanningGameweek ? undefined : "unhighlight"}
          />
          <Flex
            borderRightWidth={1}
            pl="2px"
            layerStyle={isPlanningGameweek ? undefined : "unhighlight"}
          />
        </>
      )}
      {isChangesExpanded && (
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
                    onRemoveClick={() => onRemove([change])}
                  />
                </Box>
              </Fragment>
            );
          })}
        </Flex>
      )}
    </>
  );
};

export default GameweekChanges;
