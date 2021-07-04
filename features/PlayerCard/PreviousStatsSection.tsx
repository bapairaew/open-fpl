import { Box, Flex, Grid } from "@chakra-ui/react";
import CenterFlex, {
  CenterFlexVariant,
} from "~/features/PlayerCard/CenterFlex";
import { isNullOrUndefined } from "~/features/Common/utils";
import { Player, MatchStat } from "~/features/AppData/appDataTypes";

const makeEmptyMatches = (length: number): MatchStat[] => {
  const matches: MatchStat[] = [];
  for (let i = 0; i < length; i++) {
    matches.push({
      opponent_short_title: null,
      is_home: false,
      match_xga: null,
      match_xgi: null,
    });
  }
  return matches;
};

const variants: Record<
  CenterFlexVariant,
  { showTeamsName: boolean; height: string; decimal: number }
> = {
  mini: {
    showTeamsName: false,
    height: "58px",
    decimal: 1,
  },
  default: {
    showTeamsName: true,
    height: "80px",
    decimal: 2,
  },
};

const PreviousStatsSection = ({
  variant,
  player,
}: {
  variant: CenterFlexVariant;
  player: Player;
}) => {
  const pastMatches = player.linked_data.past_matches
    ? player.linked_data.past_matches.length < 5
      ? [
          ...makeEmptyMatches(5 - player.linked_data.past_matches.length),
          ...player.linked_data.past_matches,
        ]
      : player.linked_data.past_matches
    : [];

  const { showTeamsName, height, decimal } =
    variants[variant] ?? variants.default;

  return (
    <Box height={height}>
      {pastMatches.length > 0 ? (
        <Grid gap={0} templateColumns="repeat(6, 1fr)">
          {showTeamsName && (
            <>
              {pastMatches.map((s, i) => (
                <CenterFlex
                  variant={variant}
                  key={i}
                  p={0.5}
                  fontSize="sm"
                  color="gray.600"
                  bg="gray.100"
                >
                  {(s.opponent_short_title || "")[
                    s.is_home ? "toUpperCase" : "toLowerCase"
                  ]()}
                </CenterFlex>
              ))}
              <CenterFlex
                variant={variant}
                p={0.5}
                fontSize="sm"
                color="gray.600"
                bg="gray.100"
              >
                x̅
              </CenterFlex>
            </>
          )}
          {pastMatches.map((s, i) => (
            <CenterFlex
              key={i}
              variant={variant}
              p={1}
              fontSize="sm"
              bg={
                s.match_xgi
                  ? `rgba(0, 255, 0, ${Math.min(
                      100,
                      (+(s.match_xgi || 0) * 100) / 2
                    )}%)`
                  : "transparent"
              }
            >
              {!isNullOrUndefined(s.match_xgi)
                ? (+s.match_xgi!).toFixed?.(decimal)
                : ""}
            </CenterFlex>
          ))}
          <CenterFlex variant={variant} p={1} fontSize="sm" bg="gray.100">
            {!isNullOrUndefined(player.linked_data.season_xgi)
              ? (+player.linked_data.season_xgi!).toFixed?.(decimal)
              : "N/A"}
          </CenterFlex>
          {pastMatches.map((s, i) => (
            <CenterFlex
              key={i}
              variant={variant}
              p={1}
              fontSize="sm"
              bg={
                s.match_xga
                  ? `rgba(0, 255, 0, ${Math.min(
                      100,
                      (1 - +(s.match_xga || 0)) * 100
                    )}%)`
                  : ""
              }
            >
              {!isNullOrUndefined(s.match_xga)
                ? (+s.match_xga!).toFixed?.(decimal)
                : ""}
            </CenterFlex>
          ))}
          <CenterFlex variant={variant} p={1} fontSize="sm" bg="gray.100">
            {!isNullOrUndefined(player.linked_data.season_xga)
              ? (+player.linked_data.season_xga!).toFixed?.(decimal)
              : "N/A"}
          </CenterFlex>
        </Grid>
      ) : (
        <Flex height="100%" justifyContent="center" alignItems="center">
          No stats available
        </Flex>
      )}
    </Box>
  );
};

export default PreviousStatsSection;
