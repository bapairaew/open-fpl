import {
  Box,
  Button,
  Stat,
  StatLabel,
  StatNumber,
  useDisclosure,
} from "@chakra-ui/react";
import DeadlineCountdownModal from "@open-fpl/app/features/Dashboard/DeadlineCountdownModal";
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

  const { isOpen, onOpen, onClose } = useDisclosure();

  return (
    <>
      {isOpen && <DeadlineCountdownModal isOpen={isOpen} onClose={onClose} />}

      <Box position="relative">
        <Stat borderWidth={1} p={4} borderRadius="md">
          <StatLabel>Next GW deadline</StatLabel>
          <StatNumber>{countDown ?? "N/A"}</StatNumber>
        </Stat>
        <Button
          variant="unstyled"
          aria-label="open match details"
          position="absolute"
          width="100%"
          height="100%"
          top={0}
          left={0}
          right={0}
          bottom={0}
          opactiy={0}
          onClick={onOpen}
        />
      </Box>
    </>
  );
};

export default DeadlineCountdown;
