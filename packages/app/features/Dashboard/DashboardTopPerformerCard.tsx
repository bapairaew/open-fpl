import {
  Badge,
  Box,
  Button,
  Flex,
  HStack,
  Text,
  useDisclosure,
  VStack,
} from "@chakra-ui/react";
import { GameweekPlayerStat } from "@open-fpl/app/features/Dashboard/dashboardTypes";
import DashboardTopPerformerModal from "./DashboardTopPerformerModal";

const DashboardTopPerformerCard = ({
  playerStat,
}: {
  playerStat: GameweekPlayerStat;
}) => {
  const { isOpen, onOpen, onClose } = useDisclosure();

  return (
    <>
      {isOpen && (
        <DashboardTopPerformerModal
          isOpen={isOpen}
          onClose={onClose}
          playerStat={playerStat}
        />
      )}
      <Box position="relative">
        <HStack colorScheme="red" position="absolute" top={0} left={2}>
          {playerStat.live && <Badge colorScheme="red">Live</Badge>}
          {playerStat.picked && <Badge>Picked</Badge>}
        </HStack>
        <VStack
          key={playerStat.player.id}
          minWidth="160px"
          p={4}
          borderWidth={1}
          borderRadius="md"
          alignItems="stretch"
          spacing={2}
        >
          <Box fontSize="4xl" fontWeight="black">
            {playerStat.stats?.total_points}
          </Box>
          <Text fontSize="lg" fontWeight="bold" noOfLines={1}>
            {playerStat.player.web_name}
          </Text>
          <Flex>
            <Text
              flexBasis="50%"
              textAlign="center"
              layerStyle={`fpl-team-${playerStat.player.team.short_name}`}
            >
              {playerStat.player.team.short_name}
            </Text>
            <Text
              flexBasis="50%"
              textAlign="center"
              layerStyle={`fpl-position-${playerStat.player.element_type.singular_name_short}`}
            >
              {playerStat.player.element_type.singular_name_short}
            </Text>
          </Flex>
          <Box fontSize="sm" layerStyle="subtitle">
            <Flex>
              <Text>Ownership</Text>
              <Flex
                flexGrow={1}
                justifyContent="flex-end"
                alignItems="flex-end"
              >
                <Text>{playerStat.player.selected_by_percent}%</Text>
              </Flex>
            </Flex>
            <Flex>
              <Text>Cost</Text>
              <Flex
                flexGrow={1}
                justifyContent="flex-end"
                alignItems="flex-end"
              >
                <Text>£{(playerStat.player.now_cost / 10).toFixed(1)}</Text>
              </Flex>
            </Flex>
          </Box>
        </VStack>
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

export default DashboardTopPerformerCard;
