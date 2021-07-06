import { Box } from "@chakra-ui/react";
import { Gameweek, Player } from "~/features/AppData/appDataTypes";
import { CenterFlexVariant } from "~/features/PlayerData/CenterFlex";
import FixturesSection from "~/features/PlayerData/FixturesSection";
import NameSection from "~/features/PlayerData/NameSection";
import PointsSection from "~/features/PlayerData/PointsSection";
import PreviousStatsSection from "~/features/PlayerData/PreviousStatsSection";

const PlayerGridCard = ({
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

export default PlayerGridCard;
