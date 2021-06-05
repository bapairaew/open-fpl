import { Box, Tooltip } from "@chakra-ui/react";
import FixturesSection from "~/components/PlayerCard/FixturesSection";
import NameSection from "~/components/PlayerCard/NameSection";
import PointsSection from "~/components/PlayerCard/PointsSection";
import PreviousStatsSection from "~/components/PlayerCard/PreviousStatsSection";

const PlayerCard = ({ mini, player, gameweeks }) => {
  const height = mini ? "165px" : "250px";
  return (
    <Box borderWidth={1} height={height}>
      <NameSection mini={mini} player={player} />
      <FixturesSection mini={mini} player={player} gameweeks={gameweeks} />
      <PointsSection mini={mini} player={player} />
      <PreviousStatsSection mini={mini} player={player} />
    </Box>
  );
};

export default PlayerCard;
