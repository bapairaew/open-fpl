import { MatchStat } from "~/features/AppData/appDataTypes";
import CenterFlex, {
  CenterFlexVariant,
} from "~/features/PlayerData/CenterFlex";

const PastMatchesStats = ({
  variant,
  pastMatches,
  valueKey,
  maxValue,
  sumValue,
  decimal,
  isReversedScale,
}: {
  variant: CenterFlexVariant;
  pastMatches: MatchStat[];
  valueKey: keyof MatchStat;
  maxValue: number;
  sumValue: number | null;
  decimal: number;
  isReversedScale?: boolean;
}) => {
  return (
    <>
      {pastMatches.map((s, i) => {
        const value = s[valueKey] as number | null;
        const colorScale =
          value === null
            ? 0
            : isReversedScale
            ? 100 - Math.min(100, (value! * 100) / maxValue)
            : Math.min(100, (value! * 100) / maxValue);
        return (
          <CenterFlex
            key={i}
            variant={variant}
            p={1}
            fontSize="sm"
            bg={`rgba(0, 255, 0, ${colorScale}%)`}
          >
            {value === null ? "" : value?.toFixed(decimal)}
          </CenterFlex>
        );
      })}
      {sumValue !== null && (
        <CenterFlex variant={variant} p={1} fontSize="sm" bg="gray.100">
          {sumValue.toFixed(decimal)}
        </CenterFlex>
      )}
    </>
  );
};

export default PastMatchesStats;
