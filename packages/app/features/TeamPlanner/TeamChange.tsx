import { Box, Flex, Icon, IconButton, Text, Tooltip } from "@chakra-ui/react";
import { MouseEventHandler } from "react";
import { IconType } from "react-icons";
import {
  IoAlertCircleOutline,
  IoArrowBackOutline,
  IoArrowForwardOutline,
  IoCloseOutline,
  IoDiscOutline,
  IoSwapVerticalOutline,
  IoWarningOutline,
} from "react-icons/io5";
import {
  Change,
  ChipChange,
  FullChangePlayer,
  SinglePlayerChange,
  TwoPlayersChange,
} from "~/features/TeamPlanner/teamPlannerTypes";
import { getChipDisplayName } from "~/features/TeamPlanner/chips";

export type TransferChangeVariant = "invalid" | "outdated" | "default";

export const changeVariants: Record<
  TransferChangeVariant,
  { icon?: IconType; color?: string; label?: string }
> = {
  invalid: {
    icon: IoAlertCircleOutline,
    color: "red.500",
    label: "Invalid change",
  },
  outdated: {
    icon: IoWarningOutline,
    color: "yellow.500",
    label: "Outdated change",
  },
  default: {},
};

const TeamChange = ({
  change,
  variant = "default",
  errorLabel,
  onRemoveClick,
}: {
  change: Change;
  variant?: TransferChangeVariant;
  errorLabel?: string;
  onRemoveClick?: MouseEventHandler<HTMLButtonElement>;
}) => {
  const variantProp = changeVariants[variant] ?? changeVariants.default;
  const label = errorLabel || variantProp.label;

  let mainComponent = null;

  if (change.type === "preseason") {
    mainComponent = (
      <Text width="120px" fontSize="xs" noOfLines={1} pr={2}>
        Initial Team Setup
      </Text>
    );
  } else if (change.type === "swap" || change.type === "transfer") {
    const selectedColor = change.type === "swap" ? undefined : "red";
    const targetColor = change.type === "swap" ? undefined : "green";
    const SelectedIcon =
      change.type === "swap" ? IoSwapVerticalOutline : IoArrowForwardOutline;
    const TargetIcon =
      change.type === "swap" ? IoSwapVerticalOutline : IoArrowBackOutline;

    mainComponent = (
      <Box width="120px" pr={2}>
        <Flex>
          <Icon
            as={SelectedIcon}
            fontSize="xs"
            mt={0.5}
            mr={1}
            color={selectedColor}
          />
          <Text fontSize="xs" noOfLines={1}>
            {
              (change as TwoPlayersChange<FullChangePlayer>).selectedPlayer
                ?.web_name
            }
          </Text>
        </Flex>
        <Flex>
          <Icon
            as={TargetIcon}
            fontSize="xs"
            mt={0.5}
            mr={1}
            color={targetColor}
          />
          <Text fontSize="xs" noOfLines={1}>
            {
              (change as TwoPlayersChange<FullChangePlayer>).targetPlayer
                ?.web_name
            }
          </Text>
        </Flex>
      </Box>
    );
  } else if (
    change.type === "set-captain" ||
    change.type === "set-vice-captain"
  ) {
    mainComponent = (
      <Flex width="120px" pr={2}>
        <Box
          fontSize="xs"
          fontWeight="black"
          mr={2}
          px={1}
          borderWidth={1}
          borderColor="brand.500"
          color={change.type === "set-captain" ? "white" : "brand.500"}
          bg={change.type === "set-captain" ? "brand.500" : "white"}
        >
          {change.type === "set-captain" ? "C" : "V"}
        </Box>
        <Text fontSize="xs" noOfLines={1}>
          {(change as SinglePlayerChange<FullChangePlayer>).player?.web_name}
        </Text>
      </Flex>
    );
  } else if (change.type === "use-chip") {
    mainComponent = (
      <Flex width="120px" pr={2}>
        <Icon
          as={IoDiscOutline}
          fontSize="xs"
          mt={0.5}
          mr={2}
          color="brand.500"
        />
        <Text fontSize="xs" noOfLines={1}>
          {getChipDisplayName((change as ChipChange).chip)}
        </Text>
      </Flex>
    );
  } else {
    mainComponent = (
      <Text fontSize="xs" noOfLines={1} pr={2}>
        Unknown Change
      </Text>
    );
  }

  return (
    <Flex alignItems="center" height="100%" px={2}>
      {label && (
        <Tooltip label={label} hasArrow>
          <Flex
            flexShrink={0}
            pl={2}
            height="100%"
            justifyContent="center"
            alignItems="center"
          >
            <Icon color={variantProp.color} as={variantProp.icon} mr={2} />
          </Flex>
        </Tooltip>
      )}
      {mainComponent}
      {onRemoveClick && (
        <IconButton
          onClick={onRemoveClick}
          variant="ghost"
          size="xs"
          aria-label="remove"
          icon={<Icon as={IoCloseOutline} />}
        />
      )}
    </Flex>
  );
};

export default TeamChange;
