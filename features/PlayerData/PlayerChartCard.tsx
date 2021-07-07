import { Box, Flex } from "@chakra-ui/react";
import { transparentize } from "@chakra-ui/theme-tools";
import { Radar } from "react-chartjs-2";
import AutoSizer from "react-virtualized-auto-sizer";
import { Player } from "~/features/AppData/appDataTypes";
import NameSection from "~/features/PlayerData/NameSection";
import theme from "~/theme";

const PlayerChartCard = ({ player }: { player: Player }) => {
  const maxScale = 2;
  const assumedMaxBPS90 = 50;
  const assumedMaxSeasonBPS = 250;

  const recentXGI =
    player.linked_data.past_matches &&
    player.linked_data.past_matches.length !== 0
      ? player.linked_data.past_matches.reduce(
          (s, m) => s + (m.match_xgi ?? 0),
          0
        ) / player.linked_data.past_matches.length
      : null;

  const recentXGA =
    player.linked_data.past_matches &&
    player.linked_data.past_matches.length !== 0
      ? player.linked_data.past_matches.reduce(
          (s, m) => s + (m.match_xga ?? 0),
          0
        ) / player.linked_data.past_matches.length
      : null;

  const recentBPS =
    player.linked_data.previous_gameweeks &&
    player.linked_data.previous_gameweeks.length !== 0
      ? player.linked_data.previous_gameweeks.reduce((s, m) => s + m.bps, 0) /
        ((assumedMaxBPS90 / maxScale) *
          player.linked_data.previous_gameweeks.length) // Assume that max BPS is 50, then normalise to [0, maxScale]
      : null;

  const chartData = {
    labels: [
      "Recent xGI90",
      "Recent axGA90",
      "Recent aBPS90",
      "Season xGI90",
      "Season axGA90",
      "Season aBPS",
    ],
    datasets: [
      {
        data: [
          recentXGI ?? 0,
          recentXGA ? maxScale - recentXGA : 0,
          recentBPS ?? 0,
          player.linked_data.season_xgi ?? 0,
          player.linked_data.season_xga
            ? maxScale - player.linked_data.season_xga
            : 0,
          player.total_points / (assumedMaxSeasonBPS / maxScale),
        ],
        backgroundColor: transparentize(theme.colors.brand[100], 0.2),
        borderColor: theme.colors.brand[500],
        borderWidth: 1,
      },
    ],
  };

  const chartOptions = {
    animation: false,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: false,
      },
    },
    scales: {
      r: {
        suggestedMin: 0,
        suggestedMax: maxScale,
      },
    },
  };

  return (
    <Flex flexDirection="column" borderWidth={1} height="250px">
      <NameSection player={player} />
      <Box flexGrow={1}>
        <AutoSizer>
          {({ height, width }) => {
            return (
              <Box height={`${height}px`} width={`${width}px`}>
                <Radar
                  type="radar"
                  height={height}
                  width={width}
                  data={chartData}
                  options={chartOptions}
                />
              </Box>
            );
          }}
        </AutoSizer>
      </Box>
    </Flex>
  );
};

export default PlayerChartCard;
