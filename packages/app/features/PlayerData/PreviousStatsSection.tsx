import { Box, Flex, Grid } from "@chakra-ui/react";
import CenterFlex, {
  CenterFlexVariant,
} from "@open-fpl/app/features/PlayerData/CenterFlex";
import PastMatchesStats from "@open-fpl/app/features/PlayerData/PastMatchesStats";
import { assumedMax } from "@open-fpl/app/features/PlayerData/playerData";
import {
  MatchStat,
  Player,
} from "@open-fpl/data/features/AppData/playerDataTypes";

const makeEmptyMatches = (length: number): MatchStat[] => {
  const matches: MatchStat[] = [];
  for (let i = 0; i < length; i++) {
    matches.push({
      opponent_id: null,
      opponent_short_title: null,
      is_home: false,
      match_time: null,
      match_g: null,
      match_a: null,
      match_ga: null,
      match_shots: null,
      match_key_passes: null,
      match_xg: null,
      match_xa: null,
      match_xgi: null,
      match_xga: null,
    });
  }
  return matches;
};

const variants: Record<
  CenterFlexVariant,
  { showTeamsName: boolean; decimal: number }
> = {
  mini: {
    showTeamsName: false,
    decimal: 1,
  },
  default: {
    showTeamsName: true,
    decimal: 2,
  },
};

export const getPaddedPastMatches = (player: Player): MatchStat[] => {
  return player.linked_data.past_matches
    ? player.linked_data.past_matches.length < 5
      ? [
          ...makeEmptyMatches(5 - player.linked_data.past_matches.length),
          ...player.linked_data.past_matches,
        ]
      : player.linked_data.past_matches
    : makeEmptyMatches(5);
};

export const TeamsName = ({
  pastMatches,
  variant,
  showLabel = false,
}: {
  pastMatches: MatchStat[] | null;
  variant: CenterFlexVariant;
  showLabel?: boolean;
}) => {
  return (
    <>
      {showLabel && <Box layerStyle="highlight" />}
      {pastMatches?.map((s, i) => (
        <CenterFlex
          variant={variant}
          key={i}
          p={0.5}
          fontSize="sm"
          layerStyle="highlight"
        >
          {s.is_home
            ? (s.opponent_short_title || "").toUpperCase()
            : (s.opponent_short_title || "").toLocaleLowerCase()}
        </CenterFlex>
      ))}
      <CenterFlex
        variant={variant}
        p={0.5}
        fontSize="sm"
        layerStyle="highlight"
      >
        Σ
      </CenterFlex>
    </>
  );
};

const PreviousStatsSection = ({
  variant,
  player,
  showLabel = false,
}: {
  variant: CenterFlexVariant;
  player: Player;
  showLabel?: boolean;
}) => {
  const pastMatches = getPaddedPastMatches(player);

  const { showTeamsName, decimal } = variants[variant] ?? variants.default;

  return (
    <Box width="100%">
      {pastMatches.length > 0 ? (
        <Grid
          gap={0}
          templateColumns={{
            base:
              variant === "mini"
                ? showLabel
                  ? "30px repeat(5, 1fr)"
                  : "repeat(5, 1fr)"
                : showLabel
                ? "30px repeat(6, 1fr)"
                : "repeat(6, 1fr)",
            sm: showLabel ? "30px repeat(6, 1fr)" : "repeat(6, 1fr)",
          }}
          aria-label="past matches statistics"
        >
          {showTeamsName && (
            <TeamsName
              pastMatches={pastMatches}
              variant={variant}
              showLabel={showLabel}
            />
          )}
          <PastMatchesStats
            variant={variant}
            pastMatches={pastMatches}
            statLabel="xGI"
            valueKey="match_xgi"
            maxValue={assumedMax.xgi}
            sumValue={player.linked_data.season_xgi}
            decimal={decimal}
            showLabel={showLabel}
          />
          <PastMatchesStats
            variant={variant}
            pastMatches={pastMatches}
            statLabel="xGA"
            valueKey="match_xga"
            maxValue={assumedMax.xga}
            sumValue={player.linked_data.season_xga}
            decimal={decimal}
            isReversedScale
            showLabel={showLabel}
          />
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
