import { Grid } from "@chakra-ui/react";
import CenterFlex from "~/components/PlayerCard/CenterFlex";

const makeEmptyGameweek = (length) => {
  return Array.from({ length }).fill({
    opponent_team_short_name: "",
    was_home: true,
    total_points: 0,
  });
};

const variants = {
  mini: {
    showTeamsName: false,
    pointsFontSize: "sm",
  },
  default: {
    showTeamsName: true,
    pointsFontSize: "md",
  },
};

const PointsSection = ({ variant, player }) => {
  const previousGameweeks =
    player.linked_data.previous_gameweeks?.length < 5
      ? [
          ...makeEmptyGameweek(
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
        <Grid gap={0} templateColumns="repeat(6, 1fr)">
          {previousGameweeks.map((h, i) => (
            <CenterFlex
              key={i}
              variant={variant}
              p={0.5}
              fontSize="sm"
              color="gray"
              bg="gray.100"
            >
              {h.opponent_team_short_name[
                h.was_home ? "toUpperCase" : "toLowerCase"
              ]()}
            </CenterFlex>
          ))}
          <CenterFlex
            p={0.5}
            variant={variant}
            fontSize="sm"
            color="gray"
            bg="gray.100"
          >
            Σ
          </CenterFlex>
        </Grid>
      )}
      <Grid gap={0} templateColumns="repeat(6, 1fr)">
        {previousGameweeks.map((h, i) => (
          <CenterFlex
            key={i}
            variant={variant}
            fontSize={pointsFontSize}
            bg={`rgba(0, 255, 0, ${h.bps * 2}%)`}
          >
            {h.total_points}
          </CenterFlex>
        ))}
        <CenterFlex
          variant={variant}
          fontSize={pointsFontSize}
          fontWeight="bold"
          bg="gray.100"
        >
          {player.total_points}
        </CenterFlex>
      </Grid>
    </>
  );
};

export default PointsSection;
