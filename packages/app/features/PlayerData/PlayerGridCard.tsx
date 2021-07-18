import { Box } from "@chakra-ui/react";
import { Gameweek } from "@open-fpl/data/features/AppData/appDataTypes";
import { CenterFlexVariant } from "@open-fpl/app/features/PlayerData/CenterFlex";
import FixturesSection from "@open-fpl/app/features/PlayerData/FixturesSection";
import NameSection from "@open-fpl/app/features/PlayerData/NameSection";
import { Player } from "@open-fpl/data/features/AppData/playerDataTypes";
import PointsSection from "@open-fpl/app/features/PlayerData/PointsSection";
import PreviousStatsSection from "@open-fpl/app/features/PlayerData/PreviousStatsSection";

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
    <Box borderWidth={1} height={height} overflow="hidden">
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
