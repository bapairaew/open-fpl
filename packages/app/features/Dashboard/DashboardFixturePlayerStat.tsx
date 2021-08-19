import { Box, Icon, Stack, Text } from "@chakra-ui/react";
import BatchIcons from "@open-fpl/app/features/Dashboard/BatchIcons";
import { FixturePlayerStat } from "@open-fpl/app/features/Dashboard/dashboardTypes";
import { BiFootball } from "react-icons/bi";
import { GiRunningShoe } from "react-icons/gi";

const DashboardFixturePlayerStat = ({
  playerStat,
  align,
  showBPS = false,
  fixedSizeOnDesktop = false,
}: {
  playerStat: FixturePlayerStat;
  align: "left" | "right";
  showBPS?: boolean;
  fixedSizeOnDesktop?: boolean;
}) => {
  return (
    <Stack
      ml={0.5}
      spacing={1}
      alignItems="center"
      direction={align === "left" ? "row" : "row-reverse"}
      layerStyle={playerStat.picked ? "brand" : undefined}
    >
      {showBPS && (
        <Text
          width={{ base: "23px", sm: "25px" }}
          noOfLines={1}
          textAlign="right"
        >
          {playerStat.stats?.bps ?? 0}
        </Text>
      )}
      <Text
        noOfLines={1}
        width={{ base: "auto", sm: fixedSizeOnDesktop ? "100px" : "auto" }}
        textAlign={align}
      >
        {playerStat.player.web_name}
      </Text>
      <Box
        display={{ base: "block", sm: fixedSizeOnDesktop ? "none" : "block" }}
      >
        ·
      </Box>
      <Text
        width={{ base: "auto", sm: fixedSizeOnDesktop ? "25px" : "auto" }}
        textAlign="right"
      >
        {playerStat.stats?.total_points ?? 0}
      </Text>
      <BatchIcons
        icon={<Icon as={BiFootball} />}
        count={playerStat.stats?.goals_scored ?? 0}
      />
      <BatchIcons
        icon={<Icon as={GiRunningShoe} />}
        count={playerStat.stats?.assists ?? 0}
      />
    </Stack>
  );
};

export default DashboardFixturePlayerStat;
