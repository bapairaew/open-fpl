import { Flex, Grid } from "@chakra-ui/react";
import { Gameweek, Player } from "~/features/AppData/appDataTypes";
import { difficultyColorCodes } from "~/features/AppData/fplColors";
import CenterFlex, {
  CenterFlexVariant,
} from "~/features/PlayerCard/CenterFlex";

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
    >
      {gameweeks.map((w) => {
        const games = player.linked_data.next_gameweeks.filter(
          (n) => n.event === w.id
        );

        const gameFontSize =
          variant === "mini" ? "sm" : games.length > 1 ? "sm" : "md";

        return (
          <Flex key={w.id} flexDirection="column">
            {games.length === 0 ? (
              <CenterFlex
                variant={variant}
                bg="black"
                color="white"
                height="100%"
              >
                -
              </CenterFlex>
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
                  {g.opponent_team_short_name[
                    g.is_home ? "toUpperCase" : "toLowerCase"
                  ]()}
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
