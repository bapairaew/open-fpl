import { Box, Flex, Grid } from "@chakra-ui/react";
import CenterFlex, {
  CenterFlexVariant,
} from "@open-fpl/app/features/PlayerData/CenterFlex";
import { ClientPlayer } from "@open-fpl/app/features/PlayerData/playerDataTypes";

const FixturesSection = ({
  variant = "default",
  player,
}: {
  variant?: CenterFlexVariant;
  player: ClientPlayer;
}) => {
  const height = { base: variant === "mini" ? "10px" : "32px", sm: "32px" };
  const fontSize = variant === "mini" ? "xs" : "sm";
  const textDisplay = {
    base: variant === "mini" ? "none" : "block",
    sm: "block",
  };

  return (
    <Grid
      flexShrink={0}
      gap={0}
      templateColumns="repeat(5, 1fr)"
      height={height}
      width="100%"
    >
      {player.client_data.gameweeks?.slice(0, 5).map((fixtures, i) => {
        return (
          <Flex
            key={i}
            flexDirection="column"
            alignItems="stretch"
            height="100%"
          >
            {!fixtures ? (
              <CenterFlex variant={variant} height="100%" />
            ) : (
              fixtures.map((fixture) => (
                <CenterFlex
                  key={`${fixture.opponent}_${fixture.is_home}_${i}`}
                  fontSize={fontSize}
                  variant={variant}
                  height={`${100 / fixtures.length}%`}
                  layerStyle={`fpl-difficulty-${fixture.difficulty}`}
                >
                  <Box display={textDisplay}>
                    {fixture.is_home
                      ? fixture.opponent.short_name.toUpperCase()
                      : fixture.opponent.short_name.toLowerCase()}
                  </Box>
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
