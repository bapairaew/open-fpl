import { Flex, Grid } from "@chakra-ui/react";
import { Gameweek } from "~/features/AppData/appDataTypes";
import { difficultyColorCodes } from "~/features/AppData/fplColors";
import CenterFlex, {
  CenterFlexVariant,
} from "~/features/PlayerData/CenterFlex";
import { Player } from "~/features/PlayerData/playerDataTypes";

const FixturesSection = ({
  variant,
  player,
  gameweeks,
}: {
  variant: CenterFlexVariant;
  player: Player;
  gameweeks: Gameweek[];
}) => {
  const height = variant === "mini" ? 30 : 45;

  return (
    <Grid
      flexShrink={0}
      gap={0}
      templateColumns="repeat(5, 1fr)"
      height={`${height}px`}
      width="100%"
    >
      {gameweeks.slice(0, 5).map((w) => {
        const games = player.linked_data.next_gameweeks?.filter(
          (n) => n.event === w.id
        );

        const gameFontSize =
          variant === "mini" ? "sm" : games && games.length > 1 ? "sm" : "md";

        return (
          <Flex key={w.id} flexDirection="column">
            {!games ? (
              <CenterFlex variant={variant} height="100%" />
            ) : (
              games.map((g, i) => (
                <CenterFlex
                  key={i}
                  variant={variant}
                  height={`${height / games.length}px`}
                  fontSize={gameFontSize}
                  bg={difficultyColorCodes[g.difficulty].background}
                  color={difficultyColorCodes[g.difficulty].text}
                >
                  {g.is_home
                    ? g.opponent_team_short_name.toUpperCase()
                    : g.opponent_team_short_name.toLowerCase()}
                </CenterFlex>
              ))
            )}
          </Flex>
        );
      })}
    </Grid>
  );
};

export default FixturesSection;
