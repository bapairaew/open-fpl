import { Box, Flex } from "@chakra-ui/react";
import { transparentize } from "@chakra-ui/theme-tools";
import { Radar } from "react-chartjs-2";
import AutoSizer from "react-virtualized-auto-sizer";
import { Player } from "@open-fpl/data/features/AppData/playerDataTypes";
import NameSection from "~/features/PlayerData/NameSection";
import { assumedMax, getSummarytData } from "~/features/PlayerData/playerData";
import theme from "~/theme";

const PlayerChartCard = ({ player }: { player: Player }) => {
  const {
    recentG,
    recentA,
    recentShots,
    recentKeyPasses,
    recentXG,
    recentXA,
    recentXGA,
    recentBPS,
    // seasonG,
    // seasonA,
    // seasonShots,
    // seasonKeyPasses,
    // seasonXG,
    // seasonXA,
    // seasonXGA,
    // seasonBPS,
  } = getSummarytData(player);

  const maxMap = [
    assumedMax.recentG,
    assumedMax.recentA,
    assumedMax.recentShots,
    assumedMax.recentKeyPasses,
    assumedMax.recentXG,
    assumedMax.recentXA,
    assumedMax.recentXGA,
    assumedMax.recentBPS,
    // assumedMax.seasonG,
    // assumedMax.seasonA,
    // assumedMax.seasonShots,
    // assumedMax.seasonKeyPasses,
    // assumedMax.seasonXG,
    // assumedMax.seasonXA,
    // assumedMax.seasonXGA,
    // assumedMax.seasonBPS,
  ];

  const chartData = {
    labels: [
      "Recent Goals",
      "Recent Assists",
      "Recent Shots",
      "Recent Key Passes",
      "Recent xG",
      "Recent xA",
      "Recent xGA",
      "Recent BPS",
      // "Season Goals",
      // "Season Assists",
      // "Season Shots",
      // "Season Key Passes",
      // "Season xG",
      // "Season xA",
      // "Season xGA",
      // "Season BPS",
    ],
    datasets: [
      {
        data: [
          recentG,
          recentA,
          recentShots,
          recentKeyPasses,
          recentXG,
          recentXA,
          recentXGA,
          recentBPS,
          // seasonG,
          // seasonA,
          // seasonShots,
          // seasonKeyPasses,
          // seasonXG,
          // seasonXA,
          // seasonXGA,
          // seasonBPS,
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
      tooltip: {
        callbacks: {
          label: ({ label, raw }: { label: string; raw: number }) =>
            (
              (maxMap[chartData.labels.findIndex((l) => l === label)] * raw) /
              100
            ).toFixed(2),
        },
      },
    },
    scales: {
      r: {
        suggestedMin: 0,
        suggestedMax: 100,
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
