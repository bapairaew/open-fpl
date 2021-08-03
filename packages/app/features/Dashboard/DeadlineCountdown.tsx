import { Stat, StatLabel, StatNumber, Skeleton } from "@chakra-ui/react";
import { Event } from "@open-fpl/data/features/RemoteData/fplTypes";
import formatDistanceToNowStrict from "date-fns/formatDistanceToNowStrict";
import { useEffect, useState } from "react";
import theme from "@open-fpl/common/theme";

const DeadlineCountdown = ({ currentGameweek }: { currentGameweek: Event }) => {
  const [countDown, setCountDown] = useState<string | null>(null);

  useEffect(() => {
    const interval = setInterval(() => {
      setCountDown(
        formatDistanceToNowStrict(new Date(currentGameweek.deadline_time), {
          roundingMethod: "floor",
        })
      );
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  console.log(theme);

  return (
    <Stat borderWidth={1} px={4} py={2}>
      <StatLabel>Transfer deadline</StatLabel>
      <Skeleton isLoaded={countDown !== null}>
        <StatNumber>{countDown ?? "N/A"}</StatNumber>
      </Skeleton>
    </Stat>
  );
};

export default DeadlineCountdown;
