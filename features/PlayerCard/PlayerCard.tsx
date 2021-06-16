import { Box } from "@chakra-ui/react";
import { Gameweek, Player } from "~/features/AppData/appDataTypes";
import { CenterFlexVariant } from "~/features/PlayerCard/CenterFlex";
import FixturesSection from "~/features/PlayerCard/FixturesSection";
import NameSection from "~/features/PlayerCard/NameSection";
import PointsSection from "~/features/PlayerCard/PointsSection";
import PreviousStatsSection from "~/features/PlayerCard/PreviousStatsSection";

const PlayerCard = ({
  variant = "default",
  player,
  gameweeks,
}: {
  variant?: CenterFlexVariant;
  player: Player;
  gameweeks: Gameweek[];
}) => {
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
