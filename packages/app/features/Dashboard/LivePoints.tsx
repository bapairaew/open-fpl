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

const LivePoints = ({
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
    <Stat borderWidth={1} px={4} py={2} borderRadius="md">
      <StatLabel>Live points</StatLabel>
      <StatNumber>{totalPoints.toLocaleString()}</StatNumber>
      <StatHelpText>
        {livePoints > 0 ? <StatArrow type="increase" /> : null}
        {livePoints.toLocaleString()}
      </StatHelpText>
    </Stat>
  );
};

export default LivePoints;
