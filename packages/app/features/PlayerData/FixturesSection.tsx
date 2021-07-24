import { Flex, Grid } from "@chakra-ui/react";
import { gameweeks } from "@open-fpl/app/features/Fixtures/fixturesData";
import CenterFlex, {
  CenterFlexVariant,
} from "@open-fpl/app/features/PlayerData/CenterFlex";
import { ClientPlayer } from "@open-fpl/app/features/PlayerData/playerDataTypes";
import { difficultyColorCodes } from "@open-fpl/data/features/RemoteData/fplColors";

const FixturesSection = ({
  variant,
  player,
  gameweekDelta = 0,
}: {
  variant: CenterFlexVariant;
  player: ClientPlayer;
  gameweekDelta?: number;
}) => {
  const height = variant === "mini" ? 30 : 40;

  return (
    <Grid
      flexShrink={0}
      gap={0}
      templateColumns="repeat(5, 1fr)"
      height={`${height}px`}
      width="100%"
    >
      {gameweeks.slice(gameweekDelta, gameweekDelta + 5).map((w) => {
        const fixtures = player.client_data.gameweeks?.[w];
        return (
          <Flex key={w} flexDirection="column">
            {!fixtures ? (
              <CenterFlex variant={variant} height="100%" />
            ) : (
              fixtures.map((fixture, i) => (
                <CenterFlex
                  key={i}
                  fontSize="sm"
                  variant={variant}
                  height={`${height / fixtures.length}px`}
                  bg={difficultyColorCodes[fixture.difficulty].background}
                  color={difficultyColorCodes[fixture.difficulty].text}
                >
                  {fixture.is_home
                    ? fixture.opponent.short_name.toUpperCase()
                    : fixture.opponent.short_name.toLowerCase()}
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
