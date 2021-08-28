import {
  Badge,
  Box,
  BoxProps,
  Button,
  Flex,
  HStack,
  StatArrow,
  Text,
  useDisclosure,
  VStack,
} from "@chakra-ui/react";
import numberFormatter from "@open-fpl/app/features/Common/numberFormatter";
import DashboardPlayerModal from "@open-fpl/app/features/Dashboard/DashboardPlayerModal";
import { GameweekPlayerStat } from "@open-fpl/app/features/Dashboard/dashboardTypes";

const DashboardPlayerTransfersCard = ({
  playerStat,
  onOpened,
  ...props
}: BoxProps & {
  playerStat: GameweekPlayerStat;
  onOpened?: (playerStat: GameweekPlayerStat) => void;
}) => {
  const { isOpen, onOpen, onClose } = useDisclosure();

  const transfersDelta =
    (playerStat?.player.transfers_in_event ?? 0) -
    (playerStat?.player.transfers_out_event ?? 0);
  const costDelta = playerStat.player.cost_change_event ?? 0 / 10;

  const handleOpen = () => {
    onOpen();
    onOpened?.(playerStat);
  };

  return (
    <>
      {isOpen && (
        <DashboardPlayerModal
          isOpen={isOpen}
          onClose={onClose}
          playerStat={playerStat}
        />
      )}
      <Box role="group" position="relative" {...props}>
        <HStack
          as="section"
          aria-label="player status"
          position="absolute"
          top={0}
          left={2}
        >
          {playerStat.live && <Badge colorScheme="red">Live</Badge>}
          {playerStat.picked && <Badge>Picked</Badge>}
        </HStack>
        <VStack
          role="group"
          key={playerStat.player.id}
          p={{ base: 2, sm: 4 }}
          minWidth={{ base: "120px", sm: "160px" }}
          borderWidth={1}
          borderRadius="md"
          alignItems="stretch"
          spacing={2}
        >
          <Flex
            as="section"
            aria-label="player ownership changes"
            mt={{ base: 4, sm: 0 }}
            fontSize={{ base: "xl", sm: "2xl" }}
            fontWeight="black"
            justifyContent="flex-end"
            alignItems="center"
          >
            {transfersDelta !== 0 && (
              <StatArrow
                mr={1}
                aria-label={transfersDelta > 0 ? "increase" : "decrease"}
                type={transfersDelta > 0 ? "increase" : "decrease"}
              />
            )}
            {numberFormatter(Math.abs(transfersDelta), 0)}
          </Flex>
          <Flex
            justifyContent="space-around"
            layerStyle="subtitle"
            fontSize="sm"
          >
            <Flex
              as="section"
              aria-label="player ownership"
              flexDirection="column"
              alignItems="center"
            >
              <Text as="span">Own.</Text>
              <Text as="span">{playerStat.player.selected_by_percent}%</Text>
            </Flex>
            <Flex
              as="section"
              aria-label="player cost changes"
              flexDirection="column"
              alignItems="center"
            >
              <Text as="span">Δ Cost</Text>
              <Text as="span">
                {costDelta !== 0 && (
                  <StatArrow
                    mr={1}
                    aria-label={transfersDelta > 0 ? "increase" : "decrease"}
                    type={costDelta > 0 ? "increase" : "decrease"}
                  />
                )}
                £{Math.abs(costDelta).toFixed(1)}
              </Text>
            </Flex>
          </Flex>
          <Text
            as="span"
            aria-label="player name"
            fontSize={{ base: "sm", sm: "lg" }}
            fontWeight="bold"
            noOfLines={1}
          >
            {playerStat.player.web_name}
          </Text>
          <Flex fontSize={{ base: "xs", sm: "md" }}>
            <Text
              as="span"
              aria-label="player team"
              flexBasis="50%"
              textAlign="center"
              layerStyle={`fpl-team-${playerStat.player.team.short_name}`}
            >
              {playerStat.player.team.short_name}
            </Text>
            <Text
              as="span"
              aria-label="player position"
              flexBasis="50%"
              textAlign="center"
              layerStyle={`fpl-position-${playerStat.player.element_type.singular_name_short}`}
            >
              {playerStat.player.element_type.singular_name_short}
            </Text>
          </Flex>
        </VStack>
        <Button
          variant="unstyled"
          aria-label="open player details"
          position="absolute"
          width="100%"
          height="100%"
          top={0}
          left={0}
          right={0}
          bottom={0}
          opactiy={0}
          onClick={handleOpen}
        />
      </Box>
    </>
  );
};

export default DashboardPlayerTransfersCard;
