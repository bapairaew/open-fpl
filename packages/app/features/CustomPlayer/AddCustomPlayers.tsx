import { Button, Collapse } from "@chakra-ui/react";
import { MutableRefObject, useEffect, useState } from "react";
import CustomPlayerForm from "~/features/CustomPlayer/CustomPlayerForm";
import { CustomPlayer } from "~/features/CustomPlayer/customPlayerTypes";
import { Team } from "@open-fpl/data/features/RemoteData/fplTypes";

const AddCustomPlayers = ({
  fplTeams,
  initialFocusRef,
  hasExistedPlayers,
  onPlayerAdded,
}: {
  fplTeams: Team[];
  initialFocusRef: MutableRefObject<
    HTMLInputElement | HTMLButtonElement | null
  >;
  hasExistedPlayers: boolean;
  onPlayerAdded?: (customPlayer: CustomPlayer) => void;
}) => {
  const [expanded, setExpanded] = useState(!hasExistedPlayers);

  const handleSubmit = (customPlayer: CustomPlayer) => {
    onPlayerAdded?.(customPlayer);
    setExpanded(false);
  };

  useEffect(() => {
    if (!hasExistedPlayers) {
      setExpanded(true);
    }
  }, [hasExistedPlayers]);

  useEffect(() => {
    // Once the last player is removed the input box should be auto focused
    if (
      !hasExistedPlayers &&
      expanded &&
      initialFocusRef.current instanceof HTMLInputElement
    ) {
      initialFocusRef.current.focus();
    }
  }, [hasExistedPlayers, expanded]);

  return (
    <>
      <Collapse in={!expanded} animateOpacity>
        <Button
          ref={
            expanded
              ? undefined
              : (initialFocusRef as MutableRefObject<HTMLButtonElement>)
          }
          width="100%"
          variant={hasExistedPlayers ? "outline" : "solid"}
          onClick={() => setExpanded(true)}
        >
          Add a new custom player
        </Button>
      </Collapse>
      <Collapse in={expanded} animateOpacity>
        {expanded && (
          <CustomPlayerForm
            id="add-custom-player"
            fplTeams={fplTeams}
            initialFocusRef={
              expanded
                ? (initialFocusRef as MutableRefObject<HTMLInputElement>)
                : undefined
            }
            showCloseButton={hasExistedPlayers}
            onCloseClick={() => setExpanded(false)}
            onSubmit={handleSubmit}
            buttonLabel="Add"
          />
        )}
      </Collapse>
    </>
  );
};

export default AddCustomPlayers;
