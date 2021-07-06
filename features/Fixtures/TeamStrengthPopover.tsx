import {
  Box,
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
import { ReactNode } from "react";
import { Radar } from "react-chartjs-2";
import { TeamInfo } from "~/features/Fixtures/fixturesDataTypes";
import theme from "~/theme";

const TeamStrengthPopover = ({
  team,
  children,
}: {
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
        suggestedMin: 900,
        suggestedMax: 1400,
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
                p={4}
                role="button"
                // textDecorationLine="underline"
                // textDecorationStyle="dotted"
                // textUnderlineOffset="3px"
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
