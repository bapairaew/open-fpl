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
      aria-label="next fixtures"
    >
      {player.client_data.gameweeks &&
        [0, 1, 2, 3, 4].map((i) => {
          // NOTE: player.client_data.gameweeks.map will skip `empty` element in array
          const fixtures = player.client_data.gameweeks?.[i];
          return (
            <Flex
              key={i}
              flexDirection="column"
              alignItems="stretch"
              height="inherit"
              aria-label={
                fixtures && fixtures[0] ? `gameweek ${fixtures[0].event}` : ""
              }
            >
              {!fixtures ? (
                <CenterFlex variant={variant} height="100%" />
              ) : (
                fixtures.map((fixture, index) => (
                  <CenterFlex
                    key={`${fixture.opponent.short_name}_${fixture.is_home}_${i}_${index}`}
                    fontSize={fontSize}
                    variant={variant}
                    height={`${100 / fixtures.length}%`}
                    layerStyle={`fpl-difficulty-${fixture.difficulty}`}
                  >
                    <Box
                      aria-label={`difficulty level against ${fixture.opponent.name}`}
                      aria-valuetext={`${fixture.difficulty}`}
                      display={textDisplay}
                    >
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
