import {
  Stat,
  StatArrow,
  StatHelpText,
  StatLabel,
  StatNumber,
} from "@chakra-ui/react";
import { AppLive } from "@open-fpl/app/features/Api/apiTypes";
import {
  Entry,
  EntryEventPick,
} from "@open-fpl/data/features/RemoteData/fplTypes";

const DashboardLivePoints = ({
  live,
  entry,
  currentPicks,
}: {
  live?: AppLive;
  entry: Entry;
  currentPicks: EntryEventPick[];
}) => {
  const existingPoints = entry.summary_overall_points ?? 0;
  const livePoints =
    live?.elements.reduce(
      (sum, element) =>
        sum +
        (currentPicks.some((p) => p.element === element.id)
          ? element.stats.bps
          : 0),
      0
    ) ?? 0;
  const totalPoints = existingPoints + livePoints;

  return (
    <Stat borderWidth={1} p={4} borderRadius="md">
      <StatLabel>Live points</StatLabel>
      <StatNumber>{totalPoints.toLocaleString()}</StatNumber>
      <StatHelpText>
        {livePoints > 0 ? <StatArrow type="increase" /> : null}
        {livePoints > 0 ? livePoints.toLocaleString() : null}
      </StatHelpText>
    </Stat>
  );
};

export default DashboardLivePoints;
