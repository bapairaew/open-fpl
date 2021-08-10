import { Stat, StatHelpText, StatLabel, StatNumber } from "@chakra-ui/react";
import { Event } from "@open-fpl/data/features/RemoteData/fplTypes";
import formatDistanceToNowStrict from "date-fns/formatDistanceToNowStrict";
import { useEffect, useState } from "react";

const DeadlineCountdown = ({ nextGameweek }: { nextGameweek: Event }) => {
  const deadline = new Date(nextGameweek.deadline_time);
  const [countDown, setCountDown] = useState<string>(
    formatDistanceToNowStrict(deadline, {
      roundingMethod: "floor",
    })
  );

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
    <Stat borderWidth={1} p={4} borderRadius="md">
      <StatLabel>Next GW deadline</StatLabel>
      <StatNumber>{countDown ?? "N/A"}</StatNumber>
    </Stat>
  );
};

export default DeadlineCountdown;
