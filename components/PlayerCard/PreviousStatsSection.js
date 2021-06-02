import { Box, Flex, Grid } from "@chakra-ui/react";
import CenterFlex from "~/components/PlayerCard/CenterFlex";
import { isNullOrUndefined } from "~/libs/datatype";

const makeEmptyMatch = (length) => {
  return Array.from({ length }).fill({
    opponent_short_title: null,
    match_xga: null,
    match_xgi: null,
  });
};

const PreviousStatsSection = ({ mini, player }) => {
  const pastMatches = player.linked_data.past_matches
    ? player.linked_data.past_matches.length < 5
      ? [
          ...makeEmptyMatch(5 - player.linked_data.past_matches.length),
          ...player.linked_data.past_matches,
        ]
      : player.linked_data.past_matches
    : [];

  const showTeamsName = mini ? false : true;
  const height = mini ? 58 : 80;
  const decimal = mini ? 1 : 2;

  return (
    <Box height={height}>
      {pastMatches?.length > 0 ? (
        <Grid gap={0} templateColumns="repeat(6, 1fr)">
          {showTeamsName && (
            <>
              {pastMatches.map((s, i) => (
                <CenterFlex
                  mini={mini}
                  key={i}
                  p={0.5}
                  fontSize="sm"
                  color="gray"
                  bg="gray.100"
                >
                  {(s.opponent_short_title || "")[
                    s.is_home ? "toUpperCase" : "toLowerCase"
                  ]()}
                </CenterFlex>
              ))}
              <CenterFlex
                mini={mini}
                p={0.5}
                fontSize="sm"
                color="gray"
                bg="gray.100"
              >
                x̅
              </CenterFlex>
            </>
          )}
          {pastMatches.map((s, i) => (
            <CenterFlex
              key={i}
              mini={mini}
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
                ? (+s.match_xgi).toFixed?.(decimal)
                : ""}
            </CenterFlex>
          ))}
          <CenterFlex mini={mini} p={1} fontSize="sm" bg="gray.100">
            {!isNullOrUndefined(player.linked_data.season_xgi)
              ? (+player.linked_data.season_xgi).toFixed?.(decimal)
              : "N/A"}
          </CenterFlex>
          {pastMatches.map((s, i) => (
            <CenterFlex
              key={i}
              mini={mini}
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
                ? (+s.match_xga).toFixed?.(decimal)
                : ""}
            </CenterFlex>
          ))}
          <CenterFlex mini={mini} p={1} fontSize="sm" bg="gray.100">
            {!isNullOrUndefined(player.linked_data.season_xga)
              ? +player.linked_data.season_xga.toFixed?.(decimal)
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