import { Flex, Text, useColorMode } from "@chakra-ui/react";
import CenterFlex, {
  CenterFlexVariant,
} from "@open-fpl/app/features/PlayerData/CenterFlex";
import { teamColorCodes } from "@open-fpl/app/features/TeamData/teamData";
import { Player } from "@open-fpl/data/features/AppData/playerDataTypes";
import {
  positionColorCodes,
  statusColorCodes,
} from "@open-fpl/data/features/RemoteData/fplColors";
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
  const { colorMode } = useColorMode();

  return (
    <Flex fontSize={defaultFontSize} width="100%" alignItems="stretch">
      {player.status !== "a" && (
        <Tooltip hasArrow label={player.news}>
          <CenterFlex
            variant={variant}
            bgColor={statusColorCodes(colorMode)[player.status].bg}
            color={statusColorCodes(colorMode)[player.status].color}
          >
            <IoWarningOutline />
          </CenterFlex>
        </Tooltip>
      )}
      <Flex px={2} py={1} flexGrow={1}>
        <Text
          noOfLines={1}
          fontSize={nameFontSize}
          fontWeight="bold"
          textAlign="left"
        >
          {player.web_name}
        </Text>
      </Flex>
      <CenterFlex
        width="42px"
        variant={variant}
        bgColor={
          teamColorCodes(colorMode)[player.team.short_name]
            ? teamColorCodes(colorMode)[player.team.short_name].bg
            : "transparent"
        }
        color={
          teamColorCodes(colorMode)[player.team.short_name]
            ? teamColorCodes(colorMode)[player.team.short_name].color
            : "transparent"
        }
      >
        {player.team.short_name}
      </CenterFlex>
      <CenterFlex
        width="42px"
        variant={variant}
        bgColor={
          positionColorCodes(colorMode)[player.element_type.singular_name_short]
            .background
        }
        color={
          positionColorCodes(colorMode)[player.element_type.singular_name_short]
            .text
        }
      >
        {player.element_type.singular_name_short}
      </CenterFlex>
      <CenterFlex
        variant={variant}
        bgColor={colorMode === "dark" ? "whiteAlpha.100" : "gray.100"}
        width="48px"
      >
        {(+player.selected_by_percent).toFixed(1)}%
      </CenterFlex>
      <CenterFlex
        variant={variant}
        bgColor={colorMode === "dark" ? "whiteAlpha.100" : "gray.100"}
        width="48px"
      >
        £{(player.now_cost / 10).toFixed(1)}
      </CenterFlex>
    </Flex>
  );
};

export default NameSection;
