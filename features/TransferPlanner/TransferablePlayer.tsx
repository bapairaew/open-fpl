import { Box, Button, ButtonProps, Text, Tooltip } from "@chakra-ui/react";
import { MouseEventHandler, MutableRefObject } from "react";
import { Gameweek } from "~/features/AppData/appDataTypes";
import PlayerCard from "~/features/PlayerCard/PlayerCard";
import { FullChangePlayer } from "~/features/TransferPlanner/transferPlannerTypes";

export type TransferablePlayerVariant =
  | "default"
  | "selected"
  | "swapable"
  | "disabled";

const teamPlayerVariants: Record<TransferablePlayerVariant, ButtonProps> = {
  default: {
    cursor: "pointer",
    _hover: {
      boxShadow: "md",
    },
  },
  selected: {
    cursor: "pointer",
    tabIndex: 1,
    bg: "highlight",
    boxShadow: "lg",
  },
  swapable: {
    cursor: "pointer",
    tabIndex: 1,
  },
  disabled: {
    cursor: "default",
    opacity: 0.1,
    disabled: true,
    pointerEvents: "none",
  },
};

const TransferablePlayer = ({
  ref,
  variant,
  onClick,
  player,
  gameweeks,
}: {
  ref?: MutableRefObject<HTMLButtonElement>;
  variant: TransferablePlayerVariant;
  onClick?: MouseEventHandler<HTMLButtonElement>;
  player: FullChangePlayer;
  gameweeks: Gameweek[];
}) => {
  const variantProps =
    teamPlayerVariants[variant] ?? teamPlayerVariants.default;
  const adjustedSellingPrice = player.pick.selling_price / 10;
  const adjustedPurchasePrice = player.pick.purchase_price / 10;
  return (
    <Button
      ref={ref}
      variant="unstyled"
      m={1}
      flexBasis="200px"
      borderRadius="md"
      transition="all 300ms"
      onClick={onClick}
      position="relative"
      height="auto"
      {...variantProps}
    >
      <Tooltip
        hasArrow
        label={`Sell for £${adjustedSellingPrice} | Purchased at £${adjustedPurchasePrice}`}
      >
        <Box
          position="absolute"
          top="1px"
          right="1px"
          bg="white"
          width="55px"
          height="50px"
          boxShadow="xs"
          p={1}
        >
          <Text fontWeight="bold" fontSize="sm">
            £{adjustedSellingPrice}
          </Text>
          <Text fontSize="xs" color="gray.600">
            (£{adjustedPurchasePrice})
          </Text>
        </Box>
      </Tooltip>
      <PlayerCard variant="mini" player={player} gameweeks={gameweeks} />
    </Button>
  );
};

export default TransferablePlayer;
