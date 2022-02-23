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
  VStack,
} from "@chakra-ui/react";
import FixturesSection from "@open-fpl/app/features/PlayerData/FixturesSection";
import { SwapablePlayerVariant } from "@open-fpl/app/features/TeamPlanner/SwapablePlayer/SwapablePlayer";
import { FullChangePlayer } from "@open-fpl/app/features/TeamPlanner/teamPlannerTypes";
import Image from "next/image";
import { MouseEventHandler } from "react";
import {
  IoSwapHorizontalOutline,
  IoSwapVerticalOutline,
  IoWarningOutline,
} from "react-icons/io5";

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
      layerStyle: "brandSolid",
      boxShadow: "lg",
    },
  },
  swapable: {
    buttonProps: {
      display: "block",
      variant: "outline",
      _hover: {
        bgColor: "transparent",
        boxShadow: "md",
      },
      _focus: {
        bgColor: "transparent",
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

const kitsMap: Record<string, number> = {
  ARS: 3,
  AVL: 7,
  BRE: 94,
  BHA: 36,
  BUR: 90,
  CHE: 8,
  CRY: 31,
  EVE: 11,
  LEE: 2,
  LEI: 13,
  LIV: 14,
  MCI: 43,
  MUN: 1,
  NEW: 4,
  NOR: 45,
  SOU: 20,
  TOT: 6,
  WAT: 57,
  WHU: 21,
  WOL: 39,
};

const KitSwapablePlayer = ({
  player,
  variant = "default",
  onSubstituteClick,
  onTransferClick,
  onSetCaptainClick,
  onSetViceCaptainClick,
  onOpenOptionsClick,
  ...props
}: BoxProps & {
  player: FullChangePlayer;
  variant?: SwapablePlayerVariant;
  onSubstituteClick?: MouseEventHandler<HTMLButtonElement>;
  onTransferClick?: MouseEventHandler<HTMLButtonElement>;
  onSetCaptainClick?: MouseEventHandler<HTMLButtonElement>;
  onSetViceCaptainClick?: MouseEventHandler<HTMLButtonElement>;
  onOpenOptionsClick: () => void;
}) => {
  const { buttonProps, otherButtonsProps, boxProps } =
    teamPlayerVariants[variant] ?? teamPlayerVariants.default;
  const kitImage = `https://fantasy.premierleague.com/dist/img/shirts/standard/shirt_${kitsMap[
    player.team.short_name || "ARS"
  ]!}${player.element_type.singular_name_short === "GKP" ? "_1" : ""}-220.png`;

  return (
    <>
      <Box
        position="relative"
        m={{ base: 0.5, sm: 2 }}
        {...boxProps}
        {...props}
      >
        <VStack
          spacing={0}
          borderWidth={1}
          width={{ base: "70px", sm: "160px" }}
          height={{ base: "82px", sm: "150px" }}
          fontSize={{ base: "xs", sm: "md" }}
        >
          <Flex flexGrow={1} width="100%" p={2}>
            <Box width="100%" height="100%" position="relative">
              <Image
                src={kitImage}
                layout="fill"
                objectFit="contain"
                alt={player.team.short_name}
              />
            </Box>
          </Flex>
          <HStack spacing={0} width="100%">
            {player.status !== "a" && (
              <Tooltip hasArrow label={player.news}>
                <Flex
                  mr={0.5}
                  px={1}
                  justifyContent="center"
                  alignItems="center"
                  height="100%"
                  flexShrink={0}
                  layerStyle={`fpl-status-${player.status}`}
                  aria-label="player status"
                >
                  <Icon
                    display={{ base: "none", sm: "flex" }}
                    as={IoWarningOutline}
                    aria-label={player.news}
                  />
                </Flex>
              </Tooltip>
            )}
            <Text
              as={Flex}
              noOfLines={1}
              fontWeight="bold"
              width="100%"
              px={{ base: 0, sm: 1 }}
              pt={{ base: 0.5, sm: 1 }}
              pb={{ base: 0, sm: 1 }}
              justifyContent={{ base: "center", sm: "flex-start" }}
              aria-label="player name"
            >
              {player.web_name}
            </Text>
          </HStack>
          <FixturesSection variant="mini" player={player} />
        </VStack>
        <VStack
          spacing={0}
          position="absolute"
          top="1px"
          right="1px"
          layerStyle="sticky"
          display={{ base: "none", sm: "flex" }}
        >
          <IconButton
            size="xs"
            aria-label="transfer"
            variant="ghost"
            borderRadius={0}
            icon={<Icon as={IoSwapHorizontalOutline} />}
            onClick={onTransferClick}
            {...otherButtonsProps}
          />
          <IconButton
            size="xs"
            aria-label="substitute"
            variant="ghost"
            borderRadius={0}
            icon={<Icon as={IoSwapVerticalOutline} />}
            onClick={onSubstituteClick}
            {...buttonProps}
          />
          <Button
            size="xs"
            aria-label="set as captain"
            variant={player.pick.is_captain ? "solid" : "ghost"}
            borderRadius={0}
            onClick={onSetCaptainClick}
          >
            C
          </Button>
          <Button
            size="xs"
            aria-label="set as vice captain"
            variant={player.pick.is_vice_captain ? "solid" : "ghost"}
            borderRadius={0}
            onClick={onSetViceCaptainClick}
          >
            V
          </Button>
        </VStack>
        <Button
          display={{ base: "block", sm: "none" }}
          variant="unstyled"
          aria-label={
            variant === "swapable" ? "substitute" : "open player menu"
          }
          position="absolute"
          top={0}
          left={0}
          w="100%"
          h="100%"
          borderRadius="none"
          onClick={
            variant === "swapable" ? onSubstituteClick : onOpenOptionsClick
          }
          {...buttonProps}
        />
      </Box>
    </>
  );
};

export default KitSwapablePlayer;
