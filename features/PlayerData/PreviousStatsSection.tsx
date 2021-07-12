import { Box, Flex, Grid } from "@chakra-ui/react";
import CenterFlex, {
  CenterFlexVariant,
} from "~/features/PlayerData/CenterFlex";
import PastMatchesStats from "~/features/PlayerData/PastMatchesStats";
import { assumedMax } from "~/features/PlayerData/playerData";
import { MatchStat, Player } from "~/features/PlayerData/playerDataTypes";

const makeEmptyMatches = (length: number): MatchStat[] => {
  const matches: MatchStat[] = [];
  for (let i = 0; i < length; i++) {
    matches.push({
      opponent_short_title: null,
      is_home: false,
      match_time: null,
      match_g: null,
      match_a: null,
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
}: {
  pastMatches: MatchStat[];
  variant: CenterFlexVariant;
}) => {
  return (
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
          {s.is_home
            ? (s.opponent_short_title || "").toUpperCase()
            : (s.opponent_short_title || "").toLocaleLowerCase()}
        </CenterFlex>
      ))}
      <CenterFlex
        variant={variant}
        p={0.5}
        fontSize="sm"
        color="gray.600"
        bg="gray.100"
      >
        Σ
      </CenterFlex>
    </>
  );
};

const PreviousStatsSection = ({
  variant,
  player,
}: {
  variant: CenterFlexVariant;
  player: Player;
}) => {
  const pastMatches = getPaddedPastMatches(player);

  const { showTeamsName, height, decimal } =
    variants[variant] ?? variants.default;

  return (
    <Box height={height} width="100%">
      {pastMatches.length > 0 ? (
        <Grid gap={0} templateColumns="repeat(6, 1fr)">
          {showTeamsName && player.linked_data.past_matches && (
            <TeamsName pastMatches={pastMatches} variant={variant} />
          )}
          <PastMatchesStats
            variant="mini"
            pastMatches={pastMatches}
            valueKey="match_xgi"
            maxValue={assumedMax.xgi}
            sumValue={player.linked_data.season_xgi}
            decimal={decimal}
          />
          <PastMatchesStats
            variant="mini"
            pastMatches={pastMatches}
            valueKey="match_xga"
            maxValue={assumedMax.xga}
            sumValue={player.linked_data.season_xga}
            decimal={decimal}
            isReversedScale
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
