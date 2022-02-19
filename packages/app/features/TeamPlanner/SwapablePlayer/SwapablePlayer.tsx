import { BoxProps, useDisclosure } from "@chakra-ui/react";
import SummaryStatsSwapablePlayer from "@open-fpl/app/features/TeamPlanner/SwapablePlayer/SummaryStatsSwapablePlayer";
// import StatsSwapablePlayer from "@open-fpl/app/features/TeamPlanner/SwapablePlayer/StatsSwapablePlayer";
import SwapablePlayerOptionsModal from "@open-fpl/app/features/TeamPlanner/SwapablePlayer/SwapablePlayerOptionsModal";
import { FullChangePlayer } from "@open-fpl/app/features/TeamPlanner/teamPlannerTypes";
import { MouseEventHandler } from "react";

export type SwapablePlayerVariant =
  | "default"
  | "selected"
  | "swapable"
  | "disabled";

const SwapablePlayer = ({
  player,
  variant = "default",
  onSubstituteClick,
  onTransferClick,
  onSetCaptainClick,
  onSetViceCaptainClick,
  ...props
}: BoxProps & {
  player: FullChangePlayer;
  variant?: SwapablePlayerVariant;
  onSubstituteClick?: MouseEventHandler<HTMLButtonElement>;
  onTransferClick?: MouseEventHandler<HTMLButtonElement>;
  onSetCaptainClick?: MouseEventHandler<HTMLButtonElement>;
  onSetViceCaptainClick?: MouseEventHandler<HTMLButtonElement>;
}) => {
  const { isOpen, onOpen, onClose } = useDisclosure();

  return (
    <>
      {isOpen && (
        <SwapablePlayerOptionsModal
          isOpen={isOpen}
          onClose={onClose}
          player={player}
          onSubstituteClick={onSubstituteClick}
          onTransferClick={onTransferClick}
          onSetCaptainClick={onSetCaptainClick}
          onSetViceCaptainClick={onSetViceCaptainClick}
        />
      )}
      <SummaryStatsSwapablePlayer
        player={player}
        variant={variant}
        onSubstituteClick={onSubstituteClick}
        onTransferClick={onTransferClick}
        onSetCaptainClick={onSetCaptainClick}
        onSetViceCaptainClick={onSetViceCaptainClick}
        onOpenOptionsClick={onOpen}
        {...props}
      />
    </>
  );
};

export default SwapablePlayer;
