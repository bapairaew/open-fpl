import { HStack } from "@chakra-ui/react";
import DashboardPlayerCard from "@open-fpl/app/features/Dashboard/DashboardPlayerCard";
import { GameweekPlayerStat } from "@open-fpl/app/features/Dashboard/dashboardTypes";
import { useMemo } from "react";

const DashboardTopPerformers = ({
  allCurrentGameweekPlayers,
}: {
  allCurrentGameweekPlayers: GameweekPlayerStat[];
}) => {
  const sortedCurrentGameweekPlayers = useMemo(() => {
    return allCurrentGameweekPlayers.sort((a, b) => {
      if ((a.stats?.total_points ?? 0) > (b.stats?.total_points ?? 0))
        return -1;
      if ((a.stats?.total_points ?? 0) < (b.stats?.total_points ?? 0)) return 1;
      if ((a.stats?.bps ?? 0) > (b.stats?.bps ?? 0)) return -1;
      if ((a.stats?.bps ?? 0) < (b.stats?.bps ?? 0)) return 1;
      return 0;
    });
  }, [allCurrentGameweekPlayers]);

  return (
    <HStack p={0.5} overflowX="scroll">
      {sortedCurrentGameweekPlayers?.slice(0, 10).map((s) => (
        <DashboardPlayerCard key={s.player.id} playerStat={s} />
      ))}
    </HStack>
  );
};

export default DashboardTopPerformers;
