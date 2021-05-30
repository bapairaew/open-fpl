import { Flex } from "@chakra-ui/react";
import FixturesSection from "~/components/PlayerCard/FixturesSection";
import NameSection from "~/components/PlayerCard/NameSection";
import PointsSection from "~/components/PlayerCard/PointsSection";
import PreviousStatsSection from "~/components/PlayerCard/PreviousStatsSection";

const PlayerCard = ({ mini, player, gameweeks }) => {
  const height = mini ? 165 : 250;
  return (
    <Flex flexDirection="column" borderWidth={1} height={height}>
      <NameSection mini={mini} player={player} />
      <FixturesSection mini={mini} player={player} gameweeks={gameweeks} />
      <PointsSection mini={mini} player={player} />
      <PreviousStatsSection mini={mini} player={player} />
    </Flex>
  );
};

export default PlayerCard;
