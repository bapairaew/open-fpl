import {
  Box,
  BoxProps,
  Popover,
  PopoverArrow,
  PopoverBody,
  PopoverCloseButton,
  PopoverContent,
  PopoverHeader,
  PopoverTrigger,
  Portal,
  useColorMode,
} from "@chakra-ui/react";
import { transparentize } from "@chakra-ui/theme-tools";
import { makeChartOptions } from "@open-fpl/app/features/Common/Chart/RadarChart";
import {
  assumedMax,
  assumedMin,
} from "@open-fpl/app/features/TeamData/teamData";
import { TeamInfo } from "@open-fpl/app/features/TeamData/teamDataTypes";
import theme from "@open-fpl/common/features/Theme/theme";
import { ChartOptions } from "chart.js";
import dynamic from "next/dynamic";
import { ReactNode } from "react";

const RadarChart = dynamic(
  () => import("@open-fpl/app/features/Common/Chart/RadarChart")
);

const TeamStrengthPopover = ({
  team,
  children,
  ...props
}: BoxProps & {
  team: TeamInfo;
  children: ReactNode | string;
}) => {
  const { colorMode } = useColorMode();
  const colorLevel = colorMode === "dark" ? 200 : 500;
  const chartData = {
    labels: ["Attack Home", "Attack Away", "Defence Home", "Defence Away"],
    datasets: [
      {
        label: "Strength",
        data: [
          team.strength_attack_home,
          team.strength_attack_away,
          team.strength_defence_home,
          team.strength_defence_away,
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
    scales: {
      r: {
        suggestedMin: assumedMin.teamStrength,
        suggestedMax: assumedMax.teamStrength,
      },
    },
  }) as ChartOptions<"radar">;

  return (
    <Popover strategy="fixed" isLazy placement="bottom">
      {({ isOpen }) => {
        return (
          <>
            <PopoverTrigger>
              <Box
                aria-label={`click to see ${team.name} strength`}
                role="button"
                textAlign="left"
                ml="25px"
                // textDecorationLine="underline"
                // textDecorationStyle="dotted"
                // textUnderlineOffset="3px"
                {...props}
              >
                {children}
              </Box>
            </PopoverTrigger>
            {isOpen && (
              <Portal>
                <Box zIndex="popover" position="fixed">
                  <PopoverContent>
                    <PopoverArrow />
                    <PopoverCloseButton />
                    <PopoverHeader fontWeight="black">
                      {team.name}
                    </PopoverHeader>
                    <PopoverBody>
                      <Box width="290px" height="290px">
                        <RadarChart data={chartData} options={chartOptions} />
                      </Box>
                    </PopoverBody>
                  </PopoverContent>
                </Box>
              </Portal>
            )}
          </>
        );
      }}
    </Popover>
  );
};

export default TeamStrengthPopover;
