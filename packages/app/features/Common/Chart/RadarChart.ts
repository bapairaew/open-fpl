import theme from "@open-fpl/common/features/Theme/theme";
import merge from "deepmerge";
import { Radar } from "react-chartjs-2";

export const makeChartOptions = (mode: string, options?: any) => {
  return merge(
    {
      animation: false,
      maintainAspectRatio: false,
      plugins: {
        legend: {
          labels: {
            color:
              mode === "dark"
                ? theme.colors.whiteAlpha[800]
                : theme.colors.gray[800],
          },
        },
      },
      scales: {
        r: {
          grid: {
            color:
              mode === "dark"
                ? theme.colors.whiteAlpha[300]
                : theme.colors.gray[200],
          },
          angleLines: {
            color:
              mode === "dark"
                ? theme.colors.whiteAlpha[300]
                : theme.colors.gray[200],
          },
          ticks: {
            backdropColor: mode === "dark" ? theme.colors.gray[800] : "white",
            color:
              mode === "dark"
                ? theme.colors.whiteAlpha[800]
                : theme.colors.gray[800],
          },
          pointLabels: {
            color:
              mode === "dark"
                ? theme.colors.whiteAlpha[800]
                : theme.colors.gray[800],
          },
        },
      },
    },
    options
  );
};

export default Radar;
