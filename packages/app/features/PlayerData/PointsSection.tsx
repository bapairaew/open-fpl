import { Box, Grid } from "@chakra-ui/react";
import CenterFlex, {
  CenterFlexVariant,
} from "@open-fpl/app/features/PlayerData/CenterFlex";
import {
  PastGameweek,
  Player,
} from "@open-fpl/data/features/AppData/playerDataTypes";

const makeEmptyGameweeks = (length: number): PastGameweek[] => {
  const gameweeks: PastGameweek[] = [];
  for (let i = 0; i < length; i++) {
    gameweeks.push({
      opponent_team_short_name: "",
      was_home: true,
      total_points: 0,
      kickoff_time: "",
      bps: 0,
      minutes: 0,
    });
  }
  return gameweeks;
};

const PointsSection = ({
  variant = "default",
  showTeamsName = false,
  player,
}: {
  variant?: CenterFlexVariant;
  showTeamsName?: boolean;
  player: Player;
}) => {
  const previousGameweeks =
    player.linked_data.previous_gameweeks &&
    player.linked_data.previous_gameweeks.length < 5
      ? [
          ...makeEmptyGameweeks(
            5 - player.linked_data.previous_gameweeks.length
          ),
          ...player.linked_data.previous_gameweeks,
        ]
      : player.linked_data.previous_gameweeks;

  const fontSize = variant === "mini" ? "xs" : "sm";

  return (
    <>
      {showTeamsName && (
        <Grid
          gap={0}
          templateColumns={{
            base: variant === "mini" ? "repeat(5, 1fr)" : "repeat(6, 1fr)",
            sm: "repeat(6, 1fr)",
          }}
          width="100%"
        >
          {previousGameweeks?.map((h, i) => (
            <CenterFlex
              key={i}
              p={0.5}
              variant={variant}
              fontSize={fontSize}
              color="gray.600"
              bg="gray.100"
            >
              {h.was_home
                ? h.opponent_team_short_name.toUpperCase()
                : h.opponent_team_short_name.toLocaleLowerCase()}
            </CenterFlex>
          ))}
          {previousGameweeks && (
            <CenterFlex
              p={0.5}
              variant={variant}
              fontSize={fontSize}
              color="gray.600"
              bg="gray.100"
            >
              Σ
            </CenterFlex>
          )}
        </Grid>
      )}
      <Grid gap={0} templateColumns="repeat(6, 1fr)" width="100%">
        {previousGameweeks?.map((h, i) => (
          <CenterFlex
            key={i}
            variant={variant}
            fontSize={fontSize}
            bg={`rgba(0, 255, 0, ${h.bps * 2}%)`}
            minHeight="10px"
          >
            <Box
              display={{
                base: variant === "mini" ? "none" : "block",
                sm: "block",
              }}
            >
              {h.total_points}
            </Box>
          </CenterFlex>
        ))}
        {previousGameweeks && (
          <CenterFlex
            variant={variant}
            fontSize={fontSize}
            bg="gray.100"
            display={{
              base: variant === "mini" ? "none" : "flex",
              sm: "flex",
            }}
          >
            {player.total_points}
          </CenterFlex>
        )}
      </Grid>
    </>
  );
};

export default PointsSection;
