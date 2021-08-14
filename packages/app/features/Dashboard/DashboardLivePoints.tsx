import {
  Stat,
  StatArrow,
  StatHelpText,
  StatLabel,
  StatNumber,
  useDisclosure,
  Button,
  Box,
} from "@chakra-ui/react";
import {
  AppEntry,
  AppEntryEventPick,
  AppLive,
} from "@open-fpl/app/features/Api/apiTypes";
import DashboardLivePointsModal from "@open-fpl/app/features/Dashboard/DashboardLivePointsModal";

const DashboardLivePoints = ({
  live,
  entry,
  currentPicks,
}: {
  live?: AppLive;
  entry?: AppEntry;
  currentPicks?: AppEntryEventPick[];
}) => {
  const existingPoints = entry?.summary_overall_points ?? 0;
  const livePoints =
    live?.elements.reduce(
      (sum, element) =>
        sum +
        (currentPicks?.some((p) => p.element === element.id)
          ? element.bonus
          : 0),
      0
    ) ?? 0;
  const totalPoints = existingPoints + livePoints;

  const { isOpen, onOpen, onClose } = useDisclosure();

  return (
    <>
      {isOpen && <DashboardLivePointsModal isOpen={isOpen} onClose={onClose} />}
      <Box position="relative">
        <Stat borderWidth={1} p={4} borderRadius="md">
          <StatLabel>{live ? "Live points" : "Current points"}</StatLabel>
          <StatNumber>{totalPoints.toLocaleString()}</StatNumber>
          <StatHelpText>
            {livePoints > 0 ? <StatArrow type="increase" /> : null}
            {livePoints > 0 ? livePoints.toLocaleString() : null}
          </StatHelpText>
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

export default DashboardLivePoints;
