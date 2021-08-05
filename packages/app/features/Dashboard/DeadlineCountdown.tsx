import { Skeleton, Stat, StatLabel, StatNumber } from "@chakra-ui/react";
import { Event } from "@open-fpl/data/features/RemoteData/fplTypes";
import formatDistanceToNowStrict from "date-fns/formatDistanceToNowStrict";
import { useEffect, useState } from "react";

const DeadlineCountdown = ({ nextGameweek }: { nextGameweek: Event }) => {
  const [countDown, setCountDown] = useState<string | null>(null);

  useEffect(() => {
    const interval = setInterval(() => {
      setCountDown(
        formatDistanceToNowStrict(new Date(nextGameweek.deadline_time), {
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
    </Stat>
  );
};

export default DeadlineCountdown;
