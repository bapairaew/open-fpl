import { Box, Flex, Heading, Icon, IconButton } from "@chakra-ui/react";
import { ReactNode } from "react";
import { AiOutlinePushpin } from "react-icons/ai";
import AutoSizer from "react-virtualized-auto-sizer";
import { Gameweek } from "~/features/AppData/appDataTypes";
import { useSettings } from "~/features/Settings/SettingsContext";
import { isSwapable } from "~/features/TransferPlanner/changes";
import TransferablePlayer, {
  TransferablePlayerVariant,
} from "~/features/TransferPlanner/TransferablePlayer";
import {
  FullChangePlayer,
  GroupedTeam,
} from "~/features/TransferPlanner/transferPlannerTypes";

const getVariant = (
  selectedPlayer: FullChangePlayer,
  targetPlayer: FullChangePlayer,
  teamObject: GroupedTeam
): TransferablePlayerVariant => {
  if (!selectedPlayer) {
    return "default";
  } else if (selectedPlayer === targetPlayer) {
    return "selected";
  } else if (isSwapable(selectedPlayer, targetPlayer, teamObject)) {
    return "swapable";
  } else {
    return "disabled";
  }
};

const SelectedTeamSection = ({
  heading,
  headingRightAddon,
  height,
  children,
}: {
  heading: string;
  headingRightAddon?: ReactNode;
  height: number | string;
  children: ReactNode;
}) => {
  return (
    <>
      <Flex
        px={4}
        py={2}
        bg="white"
        zIndex="sticky"
        position="sticky"
        top={0}
        borderBottomWidth={1}
        borderTopWidth={0}
        justifyContent="space-between"
        alignItems="center"
      >
        <Heading size="sm" fontWeight="black">
          {heading}
        </Heading>
        {headingRightAddon}
      </Flex>
      <Flex height={height} flexDirection="column" justifyContent="center">
        {children}
      </Flex>
    </>
  );
};

const SelectedTeam = ({
  teamObject,
  gameweeks,
  selectedPlayer,
  onPlayerSelect,
}: {
  teamObject: GroupedTeam;
  gameweeks: Gameweek[];
  selectedPlayer: FullChangePlayer;
  onPlayerSelect: (player: FullChangePlayer) => void;
}) => {
  const { preference, setPreference } = useSettings();

  const { GKP, DEF, MID, FWD, bench } = teamObject;

  const handlePlayerClick = (e, p) => {
    e.preventDefault();
    e.stopPropagation();
    onPlayerSelect?.(p);
  };

  const handleOutsideClick = () => {
    onPlayerSelect?.(null);
  };

  const handleKeyUp = (e) => {
    if (e.key === "Escape") {
      onPlayerSelect?.(null);
    }
  };

  return (
    <Box height="100%" onKeyUp={handleKeyUp} onClick={handleOutsideClick}>
      <AutoSizer>
        {({ height, width }) => {
          return (
            <Box overflow="auto" height={`${height}px`} width={`${width}px`}>
              <SelectedTeamSection heading="Starting XI" height="740px">
                {[GKP, DEF, MID, FWD].map((group, index) => {
                  return (
                    <Flex
                      key={index}
                      justifyContent="center"
                      alignItems="center"
                    >
                      {group.map((p) => (
                        <TransferablePlayer
                          key={p.id}
                          variant={getVariant(selectedPlayer, p, teamObject)}
                          onClick={(e) => handlePlayerClick(e, p)}
                          player={p}
                          gameweeks={gameweeks}
                        />
                      ))}
                    </Flex>
                  );
                })}
              </SelectedTeamSection>
              <Box
                position={
                  preference.transferPlannerPinnedBench ? "sticky" : undefined
                }
                bottom={0}
                borderTopWidth={1}
                bg="white"
              >
                <SelectedTeamSection
                  heading="Bench"
                  headingRightAddon={
                    <IconButton
                      size="xs"
                      aria-label="pin bench"
                      icon={<Icon as={AiOutlinePushpin} />}
                      variant={
                        preference.transferPlannerPinnedBench
                          ? "solid"
                          : "ghost"
                      }
                      onClick={() =>
                        setPreference({
                          ...preference,
                          transferPlannerPinnedBench:
                            !preference.transferPlannerPinnedBench,
                        })
                      }
                    />
                  }
                  height="200px"
                >
                  <Flex justifyContent="center" alignItems="center">
                    {bench.map((p) => (
                      <TransferablePlayer
                        key={p.id}
                        variant={getVariant(selectedPlayer, p, teamObject)}
                        onClick={(e) => handlePlayerClick(e, p)}
                        player={p}
                        gameweeks={gameweeks}
                      />
                    ))}
                  </Flex>
                </SelectedTeamSection>
              </Box>
            </Box>
          );
        }}
      </AutoSizer>
    </Box>
  );
};

export default SelectedTeam;
