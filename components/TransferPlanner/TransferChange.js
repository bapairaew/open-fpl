import { Box, Flex, Icon, IconButton, Text, Tooltip } from "@chakra-ui/react";
import {
  IoAlertCircleOutline,
  IoArrowBackOutline,
  IoArrowForwardOutline,
  IoCloseOutline,
  IoSwapVerticalOutline,
  IoWarningOutline,
} from "react-icons/io5";

const changeVariants = {
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

const TransferChange = ({ variant, errorLabel, change, onRemoveClick }) => {
  const selectedColor = change.type === "swap" ? undefined : "red";
  const targetColor = change.type === "swap" ? undefined : "green";
  const SelectedIcon =
    change.type === "swap" ? IoSwapVerticalOutline : IoArrowForwardOutline;
  const TargetIcon =
    change.type === "swap" ? IoSwapVerticalOutline : IoArrowBackOutline;

  const variantProp = changeVariants[variant] ?? changeVariants.default;

  return (
    <Flex alignItems="center" height="100%">
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
      <Box width="120px" px={2}>
        <Text fontSize="xs" noOfLines={1}>
          <Icon as={SelectedIcon} mr={1} color={selectedColor} />
          {change.selectedPlayer?.web_name}
        </Text>
        <Text fontSize="xs" noOfLines={1}>
          <Icon as={TargetIcon} mr={1} color={targetColor} />
          {change.targetPlayer?.web_name}
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
