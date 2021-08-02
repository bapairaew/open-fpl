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
import {
  assumedMax,
  assumedMin,
} from "@open-fpl/app/features/TeamData/teamData";
import { TeamInfo } from "@open-fpl/app/features/TeamData/teamDataTypes";
import theme from "@open-fpl/common/theme";
import dynamic from "next/dynamic";
import { ReactNode } from "react";

const RadarChart = dynamic(
  () => import("@open-fpl/app/features/Common/RadarChart")
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
        backgroundColor: transparentize(theme.colors.brand[500], 0.4),
        borderColor: theme.colors.brand[500],
        borderWidth: 1,
      },
    ],
  };

  const chartOptions = {
    animation: false,
    scales: {
      r: {
        ticks: {
          backdropColor:
            colorMode === "dark" ? theme.colors.gray[700] : "white",
          color:
            colorMode === "dark"
              ? theme.colors.whiteAlpha[800]
              : theme.colors.gray[800],
        },
        pointLabels: {
          color:
            colorMode === "dark"
              ? theme.colors.whiteAlpha[800]
              : theme.colors.gray[800],
        },
        suggestedMin: assumedMin.teamStrength,
        suggestedMax: assumedMax.teamStrength,
      },
    },
    plugins: {
      legend: {
        labels: {
          color:
            colorMode === "dark"
              ? theme.colors.whiteAlpha[800]
              : theme.colors.gray[800],
        },
      },
    },
  };

  return (
    <Popover strategy="fixed" isLazy placement="bottom">
      {({ isOpen }) => {
        return (
          <>
            <PopoverTrigger>
              <Box
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
                      <RadarChart data={chartData} options={chartOptions} />
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
