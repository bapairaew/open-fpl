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
} from "@chakra-ui/react";
import { transparentize } from "@chakra-ui/theme-tools";
import {
  assumedMax,
  assumedMin,
} from "@open-fpl/app/features/TeamData/teamData";
import { TeamInfo } from "@open-fpl/app/features/TeamData/teamDataTypes";
import theme from "@open-fpl/app/theme";
import dynamic from "next/dynamic";
import { ReactNode } from "react";

const Radar = dynamic(() => import("@open-fpl/app/features/Common/RadarChart"));

const TeamStrengthPopover = ({
  team,
  children,
  ...props
}: BoxProps & {
  team: TeamInfo;
  children: ReactNode | string;
}) => {
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
        backgroundColor: transparentize(theme.colors.brand[100], 0.2),
        borderColor: theme.colors.brand[500],
        borderWidth: 1,
      },
    ],
  };

  const chartOptions = {
    animation: false,
    scales: {
      r: {
        suggestedMin: assumedMin.teamStrength,
        suggestedMax: assumedMax.teamStrength,
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
                      <Radar
                        type="radar"
                        data={chartData}
                        options={chartOptions}
                      />
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
