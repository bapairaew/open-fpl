import { Box } from "@chakra-ui/react";
import CenterFlex, {
  CenterFlexVariant,
} from "@open-fpl/app/features/PlayerData/CenterFlex";
import { MatchStat } from "@open-fpl/data/features/AppData/playerDataTypes";

const PastMatchesStats = ({
  variant = "default",
  pastMatches,
  valueKey,
  maxValue,
  sumValue,
  decimal,
  isReversedScale,
}: {
  variant?: CenterFlexVariant;
  pastMatches: MatchStat[];
  valueKey: keyof MatchStat;
  maxValue: number;
  sumValue: number | null;
  decimal: number;
  isReversedScale?: boolean;
}) => {
  const fontSize = variant === "mini" ? "xs" : "sm";
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
            minHeight="10px"
            fontSize={fontSize}
            bg={`rgba(0, 255, 0, ${colorScale}%)`}
          >
            <Box
              display={{
                base: variant === "mini" ? "none" : "block",
                sm: "block",
              }}
            >
              {value === null ? "" : value?.toFixed(decimal)}
            </Box>
          </CenterFlex>
        );
      })}
      {sumValue !== null && (
        <CenterFlex
          variant={variant}
          fontSize={fontSize}
          bg="gray.100"
          display={{
            base: variant === "mini" ? "none" : "flex",
            sm: "flex",
          }}
        >
          {sumValue.toFixed(decimal)}
        </CenterFlex>
      )}
    </>
  );
};

export default PastMatchesStats;
