import {
  Skeleton,
  Stat,
  StatArrow,
  StatHelpText,
  StatLabel,
  StatNumber,
} from "@chakra-ui/react";
import { Event } from "@open-fpl/data/features/RemoteData/fplTypes";
import formatDistanceToNowStrict from "date-fns/formatDistanceToNowStrict";
import { useEffect, useState } from "react";

const DeadlineCountdown = ({ nextGameweek }: { nextGameweek: Event }) => {
  const [countDown, setCountDown] = useState<string | null>(null);
  const deadline = new Date(nextGameweek.deadline_time);

  useEffect(() => {
    const interval = setInterval(() => {
      setCountDown(
        formatDistanceToNowStrict(deadline, {
          roundingMethod: "floor",
        })
      );
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  return (
    <Stat borderWidth={1} px={4} py={2} borderRadius="md">
      <StatLabel>Next GW deadline</StatLabel>
      <Skeleton isLoaded={countDown !== null}>
        <StatNumber>{countDown ?? "N/A"}</StatNumber>
      </Skeleton>
      <StatHelpText>{deadline.toLocaleString()}</StatHelpText>
    </Stat>
  );
};

export default DeadlineCountdown;
