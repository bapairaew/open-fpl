import { Box, Icon, Stack, Text } from "@chakra-ui/react";
import { FixturePlayerStat } from "@open-fpl/app/features/Dashboard/dashboardTypes";
import { Fragment, ReactNode } from "react";
import { BiFootball } from "react-icons/bi";
import { GiRunningShoe } from "react-icons/gi";

const Icons = ({ icon, count }: { icon: ReactNode; count: number }) => {
  const icons = [];
  for (let i = 0; i < count; i++) {
    icons.push(<Fragment key={i}>{icon}</Fragment>);
  }
  return <>{icons}</>;
};

const DashboardFixturePlayerStat = ({
  playerStat,
  align,
}: {
  playerStat: FixturePlayerStat;
  align: "left" | "right";
}) => {
  return (
    <Stack
      ml={0.5}
      spacing={1}
      alignItems="center"
      direction={align === "left" ? "row" : "row-reverse"}
      fontWeight={playerStat.stats.picked ? "bold" : "normal"}
    >
      <Text noOfLines={1}>{playerStat.player.web_name}</Text>
      <Box layerStyle="brand" textAlign="right">
        {playerStat.stats.total_points}
      </Box>
      <Icons
        icon={<Icon as={BiFootball} layerStyle="brand" />}
        count={playerStat.stats.goals_scored}
      />
      <Icons
        icon={<Icon as={GiRunningShoe} layerStyle="brand" />}
        count={playerStat.stats.assists}
      />
      <Icons
        icon={
          <Box
            width="8px"
            height="8px"
            borderRadius="50%"
            layerStyle="yellowSolid"
          />
        }
        count={playerStat.stats.yellow_cards}
      />
      <Icons
        icon={
          <Box
            width="8px"
            height="8px"
            borderRadius="50%"
            layerStyle="redSolid"
          />
        }
        count={playerStat.stats.red_cards}
      />
    </Stack>
  );
};

export default DashboardFixturePlayerStat;
