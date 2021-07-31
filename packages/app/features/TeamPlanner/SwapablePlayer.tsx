import {
  Box,
  BoxProps,
  Button,
  ButtonProps,
  Flex,
  HStack,
  Icon,
  IconButton,
  Text,
  Tooltip,
  useDisclosure,
  VStack,
} from "@chakra-ui/react";
import FixturesSection from "@open-fpl/app/features/PlayerData/FixturesSection";
import PointsSection from "@open-fpl/app/features/PlayerData/PointsSection";
import PreviousStatsSection from "@open-fpl/app/features/PlayerData/PreviousStatsSection";
import { teamColorCodes } from "@open-fpl/app/features/TeamData/teamData";
import SwapablePlayerOptionsModal from "@open-fpl/app/features/TeamPlanner/SwapablePlayerOptionsModal";
import { FullChangePlayer } from "@open-fpl/app/features/TeamPlanner/teamPlannerTypes";
import { positionColorCodes } from "@open-fpl/data/features/RemoteData/fplColors";
import { MouseEventHandler } from "react";
import {
  IoSwapHorizontalOutline,
  IoSwapVerticalOutline,
} from "react-icons/io5";

export type SwapablePlayerVariant =
  | "default"
  | "selected"
  | "swapable"
  | "disabled";

const teamPlayerVariants: Record<
  SwapablePlayerVariant,
  {
    buttonProps: ButtonProps;
    otherButtonsProps: ButtonProps;
    boxProps: BoxProps;
  }
> = {
  default: {
    buttonProps: {},
    otherButtonsProps: {},
    boxProps: {},
  },
  selected: {
    buttonProps: {
      cursor: "pointer",
      tabIndex: 1,
    },
    otherButtonsProps: {
      disabled: true,
    },
    boxProps: {
      bg: "highlight",
      boxShadow: "lg",
      borderColor: "brand.500",
    },
  },
  swapable: {
    buttonProps: {
      display: "block",
      variant: "outline",
      _hover: {
        bg: "transparent",
        boxShadow: "md",
      },
      _focus: {
        bg: "transparent",
        boxShadow: "md",
      },
    },
    otherButtonsProps: {
      disabled: true,
      visibility: "collapse",
    },
    boxProps: {},
  },
  disabled: {
    buttonProps: {
      disabled: true,
    },
    otherButtonsProps: {
      disabled: true,
    },
    boxProps: {
      opacity: 0.1,
      pointerEvents: "none",
    },
  },
};

const SwapablePlayer = ({
  player,
  variant = "default",
  onSubstituteClick,
  onTransferClick,
  onSetCaptainClick,
  onSetViceCaptainClick,
}: {
  player: FullChangePlayer;
  variant?: SwapablePlayerVariant;
  onSubstituteClick?: MouseEventHandler<HTMLButtonElement>;
  onTransferClick?: MouseEventHandler<HTMLButtonElement>;
  onSetCaptainClick?: MouseEventHandler<HTMLButtonElement>;
  onSetViceCaptainClick?: MouseEventHandler<HTMLButtonElement>;
}) => {
  const { buttonProps, otherButtonsProps, boxProps } =
    teamPlayerVariants[variant] ?? teamPlayerVariants.default;
  const adjustedSellingPrice = player.pick.selling_price / 10;
  // const adjustedPurchasePrice = player.pick.purchase_price / 10;

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
      <Box
        position="relative"
        m={{ base: 0.5, sm: 1 }}
        role="group"
        {...boxProps}
      >
        <VStack
          spacing={0}
          transition="all 300ms"
          borderWidth={1}
          borderRadius="none"
          width={{ base: "70px", sm: "180px" }}
          height={{ base: "82px", sm: "158px" }}
        >
          <Flex
            fontWeight="bold"
            width="100%"
            px={{ base: 0, sm: 1 }}
            pt={{ base: 0.5, sm: 1 }}
            pb={{ base: 0, sm: 1 }}
            fontSize={{ base: "xs", sm: "md" }}
            justifyContent={{ base: "center", sm: "flex-start" }}
          >
            <Text noOfLines={1}>{player.web_name}</Text>
          </Flex>
          <HStack spacing={0} width="100%" fontSize="xs" alignItems="stretch">
            <Flex
              width="41px"
              display={{ base: "none", sm: "flex" }}
              justifyContent="center"
              alignItems="center"
              height="100%"
              flexShrink={0}
              bg={
                teamColorCodes[player.team.short_name]
                  ? teamColorCodes[player.team.short_name].bg
                  : "white"
              }
              color={
                teamColorCodes[player.team.short_name]
                  ? teamColorCodes[player.team.short_name].color
                  : "black"
              }
            >
              {player.team.short_name}
            </Flex>
            <Flex
              width="41px"
              display={{ base: "none", sm: "flex" }}
              justifyContent="center"
              alignItems="center"
              height="100%"
              flexShrink={0}
              bg={
                positionColorCodes[player.element_type.singular_name_short]
                  .background
              }
              color={
                positionColorCodes[player.element_type.singular_name_short].text
              }
            >
              {player.element_type.singular_name_short}
            </Flex>
            <Flex
              fontWeight={{ base: "normal", sm: "bold" }}
              flexBasis="50%"
              justifyContent="center"
              alignItems="center"
              flexGrow={1}
              px={{ base: 0, sm: 1 }}
              pt={{ base: 0, sm: 1 }}
              pb={{ base: 0.5, sm: 1 }}
            >
              £{adjustedSellingPrice.toFixed(1)}
            </Flex>
            <Flex
              px={{ base: 1, sm: 2 }}
              alignItems="center"
              fontWeight="bold"
              bg="brand.500"
              color="white"
              display={
                player.pick.is_captain || player.pick.is_vice_captain
                  ? "flex"
                  : "none"
              }
            >
              {player.pick.is_captain ? "C" : "V"}
            </Flex>
          </HStack>

          <FixturesSection variant="mini" player={player} />
          <PointsSection variant="mini" player={player} />
          <PreviousStatsSection variant="mini" player={player} />
        </VStack>
        <HStack
          spacing={0}
          position="absolute"
          top="1px"
          right="1px"
          opacity={0.3}
          bg="white"
          _groupHover={{ opacity: 1 }}
          _groupFocus={{ opacity: 1 }}
          _groupActive={{ opacity: 1 }}
          display={{ base: "none", sm: "flex" }}
        >
          <Tooltip placement="top" label="Set as vice captain">
            <Button
              size="xs"
              aria-label="set as vice captain"
              variant="ghost"
              borderRadius={0}
              onClick={onSetViceCaptainClick}
            >
              V
            </Button>
          </Tooltip>
          <Tooltip placement="top" label="Set as captain">
            <Button
              size="xs"
              aria-label="set as captain"
              variant="ghost"
              borderRadius={0}
              onClick={onSetCaptainClick}
            >
              C
            </Button>
          </Tooltip>
          <Tooltip placement="top" label="Subsitute">
            <IconButton
              size="xs"
              aria-label="subsitute"
              variant="ghost"
              borderRadius={0}
              icon={<Icon as={IoSwapVerticalOutline} />}
              onClick={onSubstituteClick}
            />
          </Tooltip>
          <Tooltip placement="top" label="Transfer">
            <IconButton
              size="xs"
              aria-label="transfer"
              variant="ghost"
              borderRadius={0}
              icon={<Icon as={IoSwapHorizontalOutline} />}
              onClick={onTransferClick}
              {...otherButtonsProps}
            />
          </Tooltip>
        </HStack>
        <Button
          display={{ base: "block", sm: "none" }}
          variant="unstyled"
          aria-label="transfer"
          position="absolute"
          top={0}
          left={0}
          w="100%"
          h="100%"
          borderRadius="none"
          onClick={variant === "swapable" ? onSubstituteClick : onOpen}
          {...buttonProps}
        />
      </Box>
    </>
  );
};

export default SwapablePlayer;