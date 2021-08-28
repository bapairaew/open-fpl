import { Flex, Icon, Text } from "@chakra-ui/react";
import CenterFlex, {
  CenterFlexVariant,
} from "@open-fpl/app/features/PlayerData/CenterFlex";
import { Player } from "@open-fpl/data/features/AppData/playerDataTypes";
import dynamic from "next/dynamic";
import { IoWarningOutline } from "react-icons/io5";

const Tooltip = dynamic(() => import("@open-fpl/app/features/Common/Tooltip"));

const variants: Record<
  CenterFlexVariant,
  {
    nameFontSize: string;
    defaultFontSize: string;
  }
> = {
  mini: {
    nameFontSize: "sm",
    defaultFontSize: "sm",
  },
  default: {
    nameFontSize: "md",
    defaultFontSize: "sm",
  },
};

const NameSection = ({
  variant = "default",
  player,
}: {
  variant?: CenterFlexVariant;
  player: Player;
}) => {
  const { nameFontSize, defaultFontSize } =
    variants[variant] ?? variants.default;
  return (
    <Flex fontSize={defaultFontSize} width="100%" alignItems="stretch">
      {player.status !== "a" && (
        <Tooltip hasArrow label={player.news}>
          <CenterFlex
            variant={variant}
            layerStyle={`fpl-status-${player.status}`}
            aria-label="player status"
          >
            <Icon as={IoWarningOutline} aria-label={player.news} />
          </CenterFlex>
        </Tooltip>
      )}
      <Flex px={2} py={1} flexGrow={1}>
        <Text
          as="span"
          aria-label="player name"
          noOfLines={1}
          fontSize={nameFontSize}
          fontWeight="bold"
          textAlign="left"
        >
          {player.web_name}
        </Text>
      </Flex>
      <CenterFlex
        aria-label="player team"
        width="42px"
        variant={variant}
        layerStyle={`fpl-team-${player.team.short_name}`}
      >
        {player.team.short_name}
      </CenterFlex>
      <CenterFlex
        aria-label="player position"
        width="42px"
        variant={variant}
        layerStyle={`fpl-position-${player.element_type.singular_name_short}`}
      >
        {player.element_type.singular_name_short}
      </CenterFlex>
      <CenterFlex
        aria-label="player ownership"
        variant={variant}
        width="48px"
        layerStyle="highlight"
      >
        {(+player.selected_by_percent).toFixed(1)}%
      </CenterFlex>
      <CenterFlex
        aria-label="player cost"
        variant={variant}
        width="48px"
        layerStyle="highlight"
      >
        £{(player.now_cost / 10).toFixed(1)}
      </CenterFlex>
    </Flex>
  );
};

export default NameSection;
