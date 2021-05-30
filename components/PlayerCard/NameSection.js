import { Flex, Text } from "@chakra-ui/react";
import { IoWarningOutline } from "react-icons/io5";
import CenterFlex from "~/components/PlayerCard/CenterFlex";
import { nFormatter } from "~/libs/numbers";

const positionColorCodes = {
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

const statusColorCodes = {
  a: "transparent", // Available
  d: "yellow", // Injured but have chance to play
  i: "red", // Injured
  n: "red", // Ineligible to play (e.g. with parent club)
  s: "red", // Suspended
};

const deltaColorCodes = {
  positive: {
    background: "rgb(1, 252, 122)",
    text: "black",
  },
  zero: {
    background: "rgb(231, 231, 231)",
    text: "black",
  },
  negative: {
    background: "rgb(255, 23, 81)",
    text: "white",
  },
};

const NameSection = ({ mini, player }) => {
  const nameFontSize = mini ? "sm" : "lg";
  const defaultFontSize = mini ? "sm" : "md";
  const showId = mini ? false : true;

  return (
    <Flex fontSize={defaultFontSize}>
      <Flex flexDirection="column">
        <CenterFlex
          mini={mini}
          bg={
            player.linked_data.teamcolorcodes.text
              ? player.linked_data.teamcolorcodes.background
              : player.linked_data.teamcolorcodes.highlight
          }
          color={
            player.linked_data.teamcolorcodes.text
              ? player.linked_data.teamcolorcodes.text
              : player.linked_data.teamcolorcodes.background
          }
        >
          {player.team.short_name}
        </CenterFlex>
        <CenterFlex
          mini={mini}
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
        <CenterFlex
          mini={mini}
          bg={statusColorCodes[player.status]}
          title={player.news}
        >
          <IoWarningOutline />
        </CenterFlex>
      )}
      <Flex px={2} py={1} flexDirection="column" flexGrow={1}>
        <Text
          noOfLines={showId ? 1 : 2}
          fontSize={nameFontSize}
          fontWeight="bold"
        >
          {player.web_name}
        </Text>
        {showId && <Text color="gray">ID: {player.id}</Text>}
      </Flex>
      <Flex flexDirection="column">
        <CenterFlex mini={mini} bg="gray.100" fontWeight="bold">
          £{(player.now_cost / 10).toFixed(1)}
        </CenterFlex>
        <CenterFlex
          mini={mini}
          bg={
            player.linked_data.transfers_delta_event === 0
              ? deltaColorCodes.zero.background
              : player.linked_data.transfers_delta_event > 0
              ? deltaColorCodes.positive.background
              : deltaColorCodes.negative.background
          }
          color={
            player.linked_data.transfers_delta_event === 0
              ? deltaColorCodes.zero.text
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
