import { Box, BoxProps, Flex, useColorMode } from "@chakra-ui/react";
import { transparentize } from "@chakra-ui/theme-tools";
import { makeChartOptions } from "@open-fpl/app/features/Common/Chart/RadarChart";
import NameSection from "@open-fpl/app/features/PlayerData/NameSection";
import {
  assumedMax,
  getSummarytData,
} from "@open-fpl/app/features/PlayerData/playerData";
import theme from "@open-fpl/common/features/Theme/theme";
import { Player } from "@open-fpl/data/features/AppData/playerDataTypes";
import dynamic from "next/dynamic";
import AutoSizer from "react-virtualized-auto-sizer";

const RadarChart = dynamic(
  () => import("@open-fpl/app/features/Common/Chart/RadarChart")
);

const PlayerChartCard = ({
  player,
  ...props
}: BoxProps & { player: Player }) => {
  const { colorMode } = useColorMode();
  const colorLevel = colorMode === "dark" ? 200 : 500;
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
        backgroundColor: transparentize(
          theme.colors.brand[colorLevel],
          0.4
        )(theme),
        borderColor: theme.colors.brand[colorLevel],
        borderWidth: 1,
      },
    ],
  };

  const chartOptions = makeChartOptions(colorMode, {
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
  });

  return (
    <Flex flexDirection="column" borderWidth={1} height="205px" {...props}>
      <NameSection player={player} />
      <Box flexGrow={1}>
        <AutoSizer>
          {({ height, width }) => {
            return (
              <Box height={`${height}px`} width={`${width}px`}>
                <RadarChart
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
