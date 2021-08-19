import { HStack } from "@chakra-ui/react";
import DashboardPlayerCard from "@open-fpl/app/features/Dashboard/DashboardPlayerCard";
import { GameweekPlayerStat } from "@open-fpl/app/features/Dashboard/dashboardTypes";

const DashboardTeamsheet = ({
  currentPicksPlayers,
}: {
  currentPicksPlayers: GameweekPlayerStat[];
}) => {
  return (
    <HStack p={0.5} overflowX="scroll">
      {currentPicksPlayers?.map((s) => (
        <DashboardPlayerCard key={s.player.id} playerStat={s} />
      ))}
    </HStack>
  );
};

export default DashboardTeamsheet;
