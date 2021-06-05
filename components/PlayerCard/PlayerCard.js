import { Box, Tooltip } from "@chakra-ui/react";
import FixturesSection from "~/components/PlayerCard/FixturesSection";
import NameSection from "~/components/PlayerCard/NameSection";
import PointsSection from "~/components/PlayerCard/PointsSection";
import PreviousStatsSection from "~/components/PlayerCard/PreviousStatsSection";

const PlayerCard = ({ variant, player, gameweeks }) => {
  const height = variant === "mini" ? "165px" : "250px";
  return (
    <Box borderWidth={1} height={height}>
      <NameSection variant={variant} player={player} />
      <FixturesSection
        variant={variant}
        player={player}
        gameweeks={gameweeks}
      />
      <PointsSection variant={variant} player={player} />
      <PreviousStatsSection variant={variant} player={player} />
    </Box>
  );
};

export default PlayerCard;
