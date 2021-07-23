import {
  Box,
  BoxProps,
  Button,
  ButtonProps,
  Flex,
  Icon,
  Menu,
  MenuButton,
  MenuItem,
  MenuList,
} from "@chakra-ui/react";
import PlayerGridCard from "@open-fpl/app/features/PlayerData/PlayerGridCard";
import { FullChangePlayer } from "@open-fpl/app/features/TeamPlanner/teamPlannerTypes";
import dynamic from "next/dynamic";
import { MouseEventHandler } from "react";
import { IoEllipsisHorizontalOutline } from "react-icons/io5";

const Tooltip = dynamic(() => import("@open-fpl/app/features/Common/Tooltip"));

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
  player,
  gameweekDelta = 0,
  variant = "default",
  showCaptainButton = false,
  onPlayerClick,
  onSetCaptainClick,
  onSetViceCaptainClick,
  ...props
}: {
  player: FullChangePlayer;
  gameweekDelta?: number;
  variant?: TransferablePlayerVariant;
  showCaptainButton?: boolean;
  onPlayerClick?: MouseEventHandler<HTMLButtonElement>;
  onSetCaptainClick?: MouseEventHandler<HTMLButtonElement>;
  onSetViceCaptainClick?: MouseEventHandler<HTMLButtonElement>;
} & BoxProps) => {
  const variantProps =
    teamPlayerVariants[variant] ?? teamPlayerVariants.default;
  const adjustedSellingPrice = player.pick.selling_price / 10;
  const adjustedPurchasePrice = player.pick.purchase_price / 10;
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
        <PlayerGridCard
          variant="mini"
          player={player}
          gameweekDelta={gameweekDelta}
        />
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
          label={`Sell for £${adjustedSellingPrice.toFixed(
            1
          )} | Purchased at £${adjustedPurchasePrice.toFixed(1)}`}
        >
          <Flex
            fontWeight="bold"
            fontSize="sm"
            flexBasis="50%"
            justifyContent="center"
            alignItems="center"
          >
            £{adjustedSellingPrice.toFixed(1)}
          </Flex>
        </Tooltip>
        {showCaptainButton && (
          <Tooltip hasArrow>
            <Box flexBasis="50%" width="100%">
              <Menu isLazy>
                <MenuButton
                  as={Button}
                  size="xs"
                  width="100%"
                  aria-label={
                    player.pick.is_captain
                      ? "Captain"
                      : player.pick.is_vice_captain
                      ? "Vice Captain"
                      : "Captain settings"
                  }
                  variant={
                    player.pick.is_captain
                      ? "solid"
                      : player.pick.is_vice_captain
                      ? "outline"
                      : "ghost"
                  }
                  borderRadius="none"
                  fontWeight="black"
                >
                  {player.pick.is_captain ? (
                    "C"
                  ) : player.pick.is_vice_captain ? (
                    "V"
                  ) : (
                    <Icon as={IoEllipsisHorizontalOutline} />
                  )}
                </MenuButton>
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
