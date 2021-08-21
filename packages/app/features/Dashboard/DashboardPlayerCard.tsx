import {
  Badge,
  Box,
  Button,
  Flex,
  HStack,
  Text,
  useDisclosure,
  VStack,
  Icon,
} from "@chakra-ui/react";
import BatchIcons from "@open-fpl/app/features/Dashboard/BatchIcons";
import DashboardPlayerModal from "@open-fpl/app/features/Dashboard/DashboardPlayerModal";
import { GameweekPlayerStat } from "@open-fpl/app/features/Dashboard/dashboardTypes";
import { BiFootball } from "react-icons/bi";
import { GiRunningShoe } from "react-icons/gi";

const DashboardPlayerCard = ({
  playerStat,
  onOpened,
}: {
  playerStat: GameweekPlayerStat;
  onOpened?: (playerStat: GameweekPlayerStat) => void;
}) => {
  const { isOpen, onOpen, onClose } = useDisclosure();
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
      <Box position="relative">
        <HStack position="absolute" top={0} left={2}>
          {playerStat.live && <Badge colorScheme="red">Live</Badge>}
          {playerStat.picked && <Badge>Picked</Badge>}
        </HStack>
        <VStack
          key={playerStat.player.id}
          p={{ base: 2, sm: 4 }}
          minWidth={{ base: "120px", sm: "160px" }}
          borderWidth={1}
          borderRadius="md"
          alignItems="stretch"
          spacing={2}
        >
          <Box
            mt={{ base: 4, sm: 0 }}
            fontSize={{ base: "xl", sm: "4xl" }}
            fontWeight="black"
          >
            {playerStat.stats?.total_points}
          </Box>
          <Text
            fontSize={{ base: "sm", sm: "lg" }}
            fontWeight="bold"
            noOfLines={1}
          >
            {playerStat.player.web_name}
          </Text>
          <Flex fontSize={{ base: "xs", sm: "md" }}>
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
          <HStack height="20px" spacing={1} flexWrap="wrap">
            <BatchIcons
              icon={<Icon as={BiFootball} />}
              count={playerStat.stats?.goals_scored ?? 0}
            />
            <BatchIcons
              icon={<Icon as={GiRunningShoe} />}
              count={playerStat.stats?.assists ?? 0}
            />
          </HStack>
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
          onClick={handleOpen}
        />
      </Box>
    </>
  );
};

export default DashboardPlayerCard;
