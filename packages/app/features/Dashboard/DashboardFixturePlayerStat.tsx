import { Box, Icon, Stack, Text, Tooltip } from "@chakra-ui/react";
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
        <Tooltip label="BPS">
          <Text
            width={{ base: "23px", sm: "25px" }}
            noOfLines={1}
            textAlign="right"
          >
            {playerStat.stats?.bps ?? 0}
          </Text>
        </Tooltip>
      )}
      <Tooltip label="Name">
        <Text
          noOfLines={1}
          width={{ base: "auto", sm: fixedSizeOnDesktop ? "100px" : "auto" }}
          textAlign={align}
        >
          {playerStat.player.web_name}
        </Text>
      </Tooltip>
      <Box
        display={{ base: "block", sm: fixedSizeOnDesktop ? "none" : "block" }}
      >
        |
      </Box>
      <Tooltip label="Points">
        <Text
          width={{ base: "auto", sm: fixedSizeOnDesktop ? "25px" : "auto" }}
          textAlign="right"
        >
          {playerStat.stats?.total_points ?? 0}
        </Text>
      </Tooltip>
      <Icons
        icon={<Icon as={BiFootball} />}
        count={playerStat.stats?.goals_scored ?? 0}
      />
      <Icons
        icon={<Icon as={GiRunningShoe} />}
        count={playerStat.stats?.assists ?? 0}
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
        count={playerStat.stats?.yellow_cards ?? 0}
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
        count={playerStat.stats?.red_cards ?? 0}
      />
    </Stack>
  );
};

export default DashboardFixturePlayerStat;
