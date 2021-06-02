import { Flex, Grid } from "@chakra-ui/react";
import CenterFlex from "~/components/PlayerCard/CenterFlex";

const difficultyColorCodes = {
  1: {
    background: "rgb(1, 252, 122)",
    text: "black",
  },
  2: {
    background: "rgb(1, 252, 122)",
    text: "black",
  },
  3: {
    background: "rgb(231, 231, 231)",
    text: "black",
  },
  4: {
    background: "rgb(255, 23, 81)",
    text: "white",
  },
  5: {
    background: "rgb(128, 7, 45)",
    text: "white",
  },
};

const FixturesSection = ({ mini, player, gameweeks }) => {
  const height = mini ? "30px" : "45px";

  return (
    <Grid
      flexShrink={0}
      gap={0}
      templateColumns="repeat(5, 1fr)"
      height={height}
    >
      {gameweeks.map((w) => {
        const games = player.linked_data.next_gameweeks.filter(
          (n) => n.event === w.id
        );

        const gameFontSize = mini ? "sm" : games.length > 1 ? "sm" : "md";

        return (
          <Flex key={w.id} flexDirection="column">
            {games.length === 0 ? (
              <CenterFlex mini={mini} bg="black" color="white" height="100%">
                -
              </CenterFlex>
            ) : (
              games.map((g, i) => (
                <CenterFlex
                  key={i}
                  mini={mini}
                  height={height / games.length}
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
