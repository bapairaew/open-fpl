import { Box, Flex, Icon, IconButton, Text, Tooltip } from "@chakra-ui/react";
import { MouseEventHandler } from "react";
import { IconType } from "react-icons";
import {
  IoAlertCircleOutline,
  IoArrowBackOutline,
  IoArrowForwardOutline,
  IoCloseOutline,
  IoSwapVerticalOutline,
  IoWarningOutline,
} from "react-icons/io5";
import {
  Change,
  FullChangePlayer,
  TeamChange,
} from "~/features/TransferPlanner/transferPlannerTypes";

export type TransferChangeVariant = "invalid" | "outdated" | "default";

const changeVariants: Record<
  TransferChangeVariant,
  { showIcon: boolean; icon?: IconType; color?: string; label?: string }
> = {
  invalid: {
    showIcon: true,
    icon: IoAlertCircleOutline,
    color: "red.500",
    label: "Invalid change",
  },
  outdated: {
    showIcon: true,
    icon: IoWarningOutline,
    color: "yellow.500",
    label: "Outdated change",
  },
  default: {
    showIcon: false,
  },
};

const TransferChange = ({
  variant,
  errorLabel,
  change,
  onRemoveClick,
}: {
  variant: TransferChangeVariant;
  errorLabel?: string;
  change: Change;
  onRemoveClick: MouseEventHandler<HTMLButtonElement>;
}) => {
  if (change.type === "preseason") {
    return (
      <Flex alignItems="center" height="100%" px={2}>
        <Text fontSize="xs" noOfLines={1} pr={2}>
          Initial team set up
        </Text>
        <IconButton
          onClick={onRemoveClick}
          variant="ghost"
          size="xs"
          aria-label="remove"
          icon={<Icon as={IoCloseOutline} />}
        />
      </Flex>
    );
  }

  const selectedColor = change.type === "swap" ? undefined : "red";
  const targetColor = change.type === "swap" ? undefined : "green";
  const SelectedIcon =
    change.type === "swap" ? IoSwapVerticalOutline : IoArrowForwardOutline;
  const TargetIcon =
    change.type === "swap" ? IoSwapVerticalOutline : IoArrowBackOutline;

  const variantProp = changeVariants[variant] ?? changeVariants.default;

  return (
    <Flex alignItems="center" height="100%" px={2}>
      {variantProp.showIcon && (
        <Tooltip label={errorLabel || variantProp.label} hasArrow>
          <Flex
            flexShrink={0}
            pl={2}
            height="100%"
            justifyContent="center"
            alignItems="center"
          >
            <Icon color={variantProp.color} as={variantProp.icon} />
          </Flex>
        </Tooltip>
      )}
      <Box width="120px" pr={2}>
        <Text fontSize="xs" noOfLines={1}>
          <Icon as={SelectedIcon} mr={1} color={selectedColor} />
          {(change as TeamChange<FullChangePlayer>).selectedPlayer?.web_name}
        </Text>
        <Text fontSize="xs" noOfLines={1}>
          <Icon as={TargetIcon} mr={1} color={targetColor} />
          {(change as TeamChange<FullChangePlayer>).targetPlayer?.web_name}
        </Text>
      </Box>
      <IconButton
        onClick={onRemoveClick}
        variant="ghost"
        size="xs"
        aria-label="remove"
        icon={<Icon as={IoCloseOutline} />}
      />
    </Flex>
  );
};

export default TransferChange;
