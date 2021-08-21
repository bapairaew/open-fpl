import { Stat, StatLabel, StatNumber } from "@chakra-ui/react";
import formatDuration from "date-fns/formatDuration";
import intervalToDuration from "date-fns/intervalToDuration";
import { useEffect, useState } from "react";

const getCountdownText = (deadline: Date) => {
  return deadline >= new Date()
    ? formatDuration(
        intervalToDuration({
          start: deadline,
          end: new Date(),
        }),
        { delimiter: "$$" }
      )
        .split("$$")
        .slice(0, 3)
        .join(" ") // Only show the first 3 parts of the duration
    : "Now";
};

const DeadlineCountdown = ({ deadline }: { deadline: Date }) => {
  const [countdown, setCountdown] = useState(getCountdownText(deadline));

  useEffect(() => {
    const interval = setInterval(() => {
      setCountdown(getCountdownText(deadline));
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  return (
    <Stat textAlign="center">
      <StatLabel>Next Gameweek deadline</StatLabel>
      <StatNumber fontSize="2xl">{countdown.toString() ?? "N/A"}</StatNumber>
    </Stat>
  );
};

export default DeadlineCountdown;
