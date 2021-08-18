import {
  Box,
  Button,
  Stat,
  StatLabel,
  StatNumber,
  useDisclosure,
} from "@chakra-ui/react";
import { Player } from "@open-fpl/data/features/AppData/playerDataTypes";
import DeadlineCountdownModal from "@open-fpl/app/features/Dashboard/DeadlineCountdownModal";

const DeadlineCountdown = ({
  countDown,
}: // players,
{
  countDown: string;
  // players: Player[];
}) => {
  const { isOpen, onOpen, onClose } = useDisclosure();

  return (
    <>
      {/* {isOpen && (
        <DeadlineCountdownModal
          isOpen={isOpen}
          onClose={onClose}
          players={players}
        />
      )} */}
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
