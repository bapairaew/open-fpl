import { BoxProps, Box, Icon, Stack, Text } from "@chakra-ui/react";
import BatchIcons from "@open-fpl/app/features/Dashboard/BatchIcons";
import { FixturePlayerStat } from "@open-fpl/app/features/Dashboard/dashboardTypes";
import { BiFootball } from "react-icons/bi";
import { GiRunningShoe } from "react-icons/gi";

const DashboardFixturePlayerStat = ({
  playerStat,
  align,
  showBPS = false,
  fixedSizeOnDesktop = false,
  ...props
}: BoxProps & {
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
      aria-label={
        playerStat.picked
          ? "player statistics (in your team)"
          : "player statistics"
      }
      {...props}
    >
      {showBPS && (
        <Text
          as="span"
          aria-label="bps"
          width={{ base: "23px", sm: "25px" }}
          noOfLines={1}
          textAlign="right"
        >
          {playerStat.stats?.bps ?? 0}
        </Text>
      )}
      <Text
        as="span"
        aria-label="player name"
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
        as="span"
        aria-label="total points"
        width={{ base: "auto", sm: fixedSizeOnDesktop ? "25px" : "auto" }}
        textAlign="right"
      >
        {playerStat.stats?.total_points ?? 0}
      </Text>
      <Stack
        spacing={1}
        alignItems="center"
        direction={align === "left" ? "row" : "row-reverse"}
        aria-label="goals"
        aria-valuetext={`${playerStat.stats?.goals_scored ?? 0}`}
      >
        <BatchIcons
          icon={<Icon as={BiFootball} />}
          count={playerStat.stats?.goals_scored ?? 0}
        />
      </Stack>
      <Stack
        spacing={1}
        alignItems="center"
        direction={align === "left" ? "row" : "row-reverse"}
        aria-label="assists"
        aria-valuetext={`${playerStat.stats?.assists ?? 0}`}
      >
        <BatchIcons
          icon={<Icon as={GiRunningShoe} />}
          count={playerStat.stats?.assists ?? 0}
        />
      </Stack>
    </Stack>
  );
};

export default DashboardFixturePlayerStat;
