import { Flex, Text, Tooltip } from "@chakra-ui/react";
import { IoWarningOutline } from "react-icons/io5";
import { Player } from "~/features/AppData/appDataTypes";
import { nFormatter } from "~/features/Common/utils";
import CenterFlex, {
  CenterFlexVariant,
} from "~/features/PlayerCard/CenterFlex";
import { ElementStatus } from "~/features/AppData/fplTypes";

const positionColorCodes: Record<string, { background: string; text: string }> =
  {
    FWD: {
      background: "rgb(233, 0, 82)",
      text: "white",
    },
    MID: {
      background: "rgb(5, 240, 255)",
      text: "rgb(55, 0, 60)",
    },
    DEF: {
      background: "rgb(0, 255, 135)",
      text: "rgb(55, 0, 60)",
    },
    GKP: {
      background: "rgb(235, 255, 0)",
      text: "rgb(55, 0, 60)",
    },
  };

const statusColorCodes: Record<ElementStatus, string> = {
  a: "transparent", // Available
  d: "yellow", // Injured but have chance to play
  i: "red", // Injured
  n: "red", // Ineligible to play (e.g. with parent club)
  s: "red", // Suspended
  u: "red", // Unavailable
};

const deltaColorCodes: Record<
  "positive" | "neutral" | "negative",
  { background: string; text: string }
> = {
  positive: {
    background: "rgb(1, 252, 122)",
    text: "black",
  },
  neutral: {
    background: "rgb(231, 231, 231)",
    text: "black",
  },
  negative: {
    background: "rgb(255, 23, 81)",
    text: "white",
  },
};

const variants: Record<
  CenterFlexVariant,
  { nameFontSize: string; defaultFontSize: string; showId: boolean }
> = {
  mini: {
    nameFontSize: "sm",
    defaultFontSize: "sm",
    showId: false,
  },
  default: {
    nameFontSize: "lg",
    defaultFontSize: "md",
    showId: true,
  },
};

const NameSection = ({
  variant,
  player,
}: {
  variant: CenterFlexVariant;
  player: Player;
}) => {
  const { nameFontSize, defaultFontSize, showId } =
    variants[variant] ?? variants.default;

  return (
    <Flex fontSize={defaultFontSize}>
      <Flex flexDirection="column">
        <CenterFlex
          variant={variant}
          bg={
            player.linked_data.teamcolorcodes
              ? player.linked_data.teamcolorcodes.text
                ? player.linked_data.teamcolorcodes.background!
                : player.linked_data.teamcolorcodes.highlight!
              : undefined
          }
          color={
            player.linked_data.teamcolorcodes
              ? player.linked_data.teamcolorcodes.text
                ? player.linked_data.teamcolorcodes.text!
                : player.linked_data.teamcolorcodes.background!
              : undefined
          }
        >
          {player.team.short_name}
        </CenterFlex>
        <CenterFlex
          variant={variant}
          bg={
            positionColorCodes[player.element_type.singular_name_short]
              .background
          }
          color={
            positionColorCodes[player.element_type.singular_name_short].text
          }
        >
          {player.element_type.singular_name_short}
        </CenterFlex>
      </Flex>
      {player.status !== "a" && (
        <Tooltip hasArrow label={player.news}>
          <Flex>
            <CenterFlex variant={variant} bg={statusColorCodes[player.status]}>
              <IoWarningOutline />
            </CenterFlex>
          </Flex>
        </Tooltip>
      )}
      <Flex
        px={2}
        py={1}
        flexDirection="column"
        flexGrow={1}
        whiteSpace="pre-wrap"
      >
        <Text
          noOfLines={showId ? 1 : 2}
          fontSize={nameFontSize}
          fontWeight="bold"
          textAlign="left"
        >
          {player.web_name}
        </Text>
        {showId && <Text color="gray">ID: {player.id}</Text>}
      </Flex>
      <Flex flexDirection="column">
        <CenterFlex variant={variant} bg="gray.100" fontWeight="bold">
          £{(player.now_cost / 10).toFixed(1)}
        </CenterFlex>
        <CenterFlex
          variant={variant}
          bg={
            player.linked_data.transfers_delta_event === 0
              ? deltaColorCodes.neutral.background
              : player.linked_data.transfers_delta_event > 0
              ? deltaColorCodes.positive.background
              : deltaColorCodes.negative.background
          }
          color={
            player.linked_data.transfers_delta_event === 0
              ? deltaColorCodes.neutral.text
              : player.linked_data.transfers_delta_event > 0
              ? deltaColorCodes.positive.text
              : deltaColorCodes.negative.text
          }
        >
          {nFormatter(player.linked_data.transfers_delta_event, 1)}
        </CenterFlex>
      </Flex>
    </Flex>
  );
};

export default NameSection;
