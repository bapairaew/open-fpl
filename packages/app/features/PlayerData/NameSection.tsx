import { Flex, Text, Tooltip } from "@chakra-ui/react";
import { IoWarningOutline } from "react-icons/io5";
import CenterFlex, {
  CenterFlexVariant,
} from "@open-fpl/app/features/PlayerData/CenterFlex";
import { Player } from "@open-fpl/data/features/AppData/playerDataTypes";
import {
  positionColorCodes,
  statusColorCodes,
} from "@open-fpl/data/features/RemoteData/fplColors";

const variants: Record<
  CenterFlexVariant,
  {
    nameFontSize: string;
    defaultFontSize: string;
    showId: boolean;
    priceWidth: string;
    nameWidth: string;
  }
> = {
  mini: {
    nameFontSize: "sm",
    defaultFontSize: "sm",
    showId: false,
    priceWidth: "50px",
    nameWidth: "40px",
  },
  default: {
    nameFontSize: "lg",
    defaultFontSize: "md",
    showId: true,
    priceWidth: "70px",
    nameWidth: "50px",
  },
};

const NameSection = ({
  variant = "default",
  player,
}: {
  variant?: CenterFlexVariant;
  player: Player;
}) => {
  const { nameFontSize, defaultFontSize, showId, priceWidth, nameWidth } =
    variants[variant] ?? variants.default;

  return (
    <Flex fontSize={defaultFontSize} width="100%">
      <Flex flexDirection="column" width={nameWidth}>
        <CenterFlex
          variant={variant}
          flexBasis="50%"
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
          flexBasis="50%"
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
          <CenterFlex variant={variant} bg={statusColorCodes[player.status]}>
            <IoWarningOutline />
          </CenterFlex>
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
      <Flex flexDirection="column" width={priceWidth}>
        <CenterFlex variant={variant} bg="gray.100">
          £{(player.now_cost / 10).toFixed(1)}
        </CenterFlex>
        <CenterFlex variant={variant} bg="gray.100">
          {(+player.selected_by_percent).toFixed(1)}%
        </CenterFlex>
      </Flex>
    </Flex>
  );
};

export default NameSection;
