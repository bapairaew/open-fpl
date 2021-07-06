import {
  Box,
  BoxProps,
  Button,
  ButtonProps,
  Flex,
  Icon,
  IconButton,
  Menu,
  MenuButton,
  MenuItem,
  MenuList,
  Tooltip,
} from "@chakra-ui/react";
import { MouseEventHandler } from "react";
import { IoStarOutline } from "react-icons/io5";
import { Gameweek } from "~/features/AppData/appDataTypes";
import PlayerGridCard from "~/features/PlayerData/PlayerGridCard";
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
  variant,
  player,
  gameweeks,
  showCaptainButton = false,
  onPlayerClick,
  onSetCaptainClick,
  onSetViceCaptainClick,
  ...props
}: {
  variant: TransferablePlayerVariant;
  player: FullChangePlayer;
  gameweeks: Gameweek[];
  showCaptainButton?: boolean;
  onPlayerClick?: MouseEventHandler<HTMLButtonElement>;
  onSetCaptainClick?: MouseEventHandler<HTMLButtonElement>;
  onSetViceCaptainClick?: MouseEventHandler<HTMLButtonElement>;
} & BoxProps) => {
  const variantProps =
    teamPlayerVariants[variant] ?? teamPlayerVariants.default;
  const adjustedSellingPrice = player.pick.selling_price / 10;
  const adjustedPurchasePrice = player.pick.purchase_price / 10;
  const captainTooltipText = player.pick.is_captain
    ? "Captain"
    : player.pick.is_vice_captain
    ? "Vice Captain"
    : "Set as captain";
  return (
    <Box position="relative" m={1} {...props}>
      <Button
        variant="unstyled"
        width="100%"
        height="auto"
        fontWeight="inherit"
        textAlign="inherit"
        transition="all 300ms"
        onClick={onPlayerClick}
        {...variantProps}
      >
        <PlayerGridCard variant="mini" player={player} gameweeks={gameweeks} />
      </Button>
      <Flex
        position="absolute"
        top="1px"
        right="1px"
        bg="white"
        width="50px"
        height="50px"
        boxShadow="xs"
        flexDirection="column"
        alignItems="center"
      >
        <Tooltip
          hasArrow
          label={`Sell for £${adjustedSellingPrice} | Purchased at £${adjustedPurchasePrice}`}
        >
          <Flex
            fontWeight="bold"
            fontSize="sm"
            flexBasis="50%"
            justifyContent="center"
            alignItems="center"
          >
            £{adjustedSellingPrice}
          </Flex>
        </Tooltip>
        {showCaptainButton && (
          <Tooltip hasArrow label={captainTooltipText}>
            <Box flexBasis="50%" width="100%">
              <Menu>
                <MenuButton
                  as={IconButton}
                  size="xs"
                  width="100%"
                  aria-label={captainTooltipText}
                  variant={
                    player.pick.is_captain
                      ? "solid"
                      : player.pick.is_vice_captain
                      ? "outline"
                      : "ghost"
                  }
                  borderRadius="none"
                  icon={<Icon aria-label="help" as={IoStarOutline} />}
                />
                <MenuList>
                  <MenuItem onClick={onSetCaptainClick}>
                    Set as captain
                  </MenuItem>
                  <MenuItem onClick={onSetViceCaptainClick}>
                    Set as vice captain
                  </MenuItem>
                </MenuList>
              </Menu>
            </Box>
          </Tooltip>
        )}
      </Flex>
    </Box>
  );
};

export default TransferablePlayer;
