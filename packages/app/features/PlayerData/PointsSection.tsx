import { Grid } from "@chakra-ui/react";
import {
  PastGameweek,
  Player,
} from "@open-fpl/data/features/AppData/playerDataTypes";
import CenterFlex, {
  CenterFlexVariant,
} from "@open-fpl/app/features/PlayerData/CenterFlex";

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

const variants: Record<
  CenterFlexVariant,
  { showTeamsName: boolean; pointsFontSize: string }
> = {
  mini: {
    showTeamsName: false,
    pointsFontSize: "sm",
  },
  default: {
    showTeamsName: true,
    pointsFontSize: "md",
  },
};

const PointsSection = ({
  variant,
  player,
}: {
  variant: CenterFlexVariant;
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

  const { showTeamsName, pointsFontSize } =
    variants[variant] ?? variants.default;

  return (
    <>
      {showTeamsName && (
        <Grid gap={0} templateColumns="repeat(6, 1fr)" width="100%">
          {previousGameweeks?.map((h, i) => (
            <CenterFlex
              key={i}
              variant={variant}
              p={0.5}
              fontSize="sm"
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
              fontSize="sm"
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
            fontSize={pointsFontSize}
            bg={`rgba(0, 255, 0, ${h.bps * 2}%)`}
          >
            {h.total_points}
          </CenterFlex>
        ))}
        {previousGameweeks && (
          <CenterFlex variant={variant} fontSize={pointsFontSize} bg="gray.100">
            {player.total_points}
          </CenterFlex>
        )}
      </Grid>
    </>
  );
};

export default PointsSection;
