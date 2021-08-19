import { HStack } from "@chakra-ui/react";
import { ApiEntryEventPick } from "@open-fpl/app/features/Api/apiTypes";
import DashboardPlayerCard from "@open-fpl/app/features/Dashboard/DashboardPlayerCard";
import { GameweekPlayerStat } from "@open-fpl/app/features/Dashboard/dashboardTypes";

const DashboardTeamsheet = ({
  currentPicks,
  allCurrentGameweekPlayers,
}: {
  currentPicks?: ApiEntryEventPick[];
  allCurrentGameweekPlayers: GameweekPlayerStat[];
}) => {
  const teamsheet = (
    currentPicks?.map((p) => {
      return allCurrentGameweekPlayers.find((s) => p.element === s.player.id);
    }) ?? []
  ).filter((x) => x) as GameweekPlayerStat[];

  return (
    <HStack p={0.5} overflowX="scroll">
      {teamsheet?.map((s) => (
        <DashboardPlayerCard key={s.player.id} playerStat={s} />
      ))}
    </HStack>
  );
};

export default DashboardTeamsheet;
