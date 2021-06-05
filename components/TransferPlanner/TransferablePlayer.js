import { Box, Text, Tooltip } from "@chakra-ui/react";
import PlayerCard from "~/components/PlayerCard/PlayerCard";

const teamPlayerVariants = {
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
  },
};

const TransferablePlayer = ({ ref, variant, onClick, player, gameweeks }) => {
  const variantProps = teamPlayerVariants[variant] ?? varaints.default;
  const adjustedSellingPrice = player.pick.selling_price / 10;
  const adjustedPurchasePrice = player.pick.purchase_price / 10;
  return (
    <Box
      as="button"
      ref={ref}
      m={1}
      flexBasis="200px"
      borderRadius="md"
      transition="all 300ms"
      onClick={onClick}
      position="relative"
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
          width="50px"
          height="50px"
          boxShadow="xs"
          p={1}
        >
          <Text fontWeight="bold" fontSize="sm">
            £{adjustedSellingPrice}
          </Text>
          <Text fontSize="xs" color="gray">
            (£{adjustedPurchasePrice})
          </Text>
        </Box>
      </Tooltip>
      <PlayerCard variant="mini" player={player} gameweeks={gameweeks} />
    </Box>
  );
};

export default TransferablePlayer;
