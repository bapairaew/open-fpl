import { Box, Flex, Heading, Icon, IconButton } from "@chakra-ui/react";
import { AnalyticsTeamPlanner } from "@open-fpl/app/features/Analytics/analyticsTypes";
import { useSettings } from "@open-fpl/app/features/Settings/Settings";
import SwapablePlayer, {
  SwapablePlayerVariant,
} from "@open-fpl/app/features/TeamPlanner/SwapablePlayer";
import { isSwapable } from "@open-fpl/app/features/TeamPlanner/teamPlan";
import {
  FullChangePlayer,
  GroupedTeam,
} from "@open-fpl/app/features/TeamPlanner/teamPlannerTypes";
import { usePlausible } from "next-plausible";
import { KeyboardEvent, MouseEvent, ReactNode } from "react";
import { AiOutlinePushpin } from "react-icons/ai";
import AutoSizer from "react-virtualized-auto-sizer";

const getVariant = (
  selectedPlayer: FullChangePlayer | null,
  targetPlayer: FullChangePlayer,
  teamObject: GroupedTeam
): SwapablePlayerVariant => {
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
  height = "auto",
  children,
}: {
  heading: string;
  headingRightAddon?: ReactNode;
  height?: number | string;
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
      <Flex
        height={height}
        flexDirection="column"
        justifyContent="center"
        py={2}
      >
        {children}
      </Flex>
    </>
  );
};

const SelectedTeam = ({
  teamObject,
  selectedPlayer,
  onPlayerSub,
  onPlayerTransfer,
  onSetCaptain,
  onSetViceCaptain,
  onCancel,
}: {
  teamObject: GroupedTeam;
  selectedPlayer: FullChangePlayer | null;
  onPlayerSub: (player: FullChangePlayer | null) => void;
  onPlayerTransfer: (player: FullChangePlayer | null) => void;
  onSetCaptain: (player: FullChangePlayer) => void;
  onSetViceCaptain: (player: FullChangePlayer) => void;
  onCancel: () => void;
}) => {
  const plausible = usePlausible<AnalyticsTeamPlanner>();
  const { teamPlannerPinnedBench, setTeamPlannerPinnedBench } = useSettings();

  const { GKP, DEF, MID, FWD, bench } = teamObject;

  const handlePlayerSubClick = (
    e: MouseEvent<HTMLButtonElement>,
    p: FullChangePlayer
  ) => {
    e.preventDefault();
    e.stopPropagation();
    onPlayerSub(p);
  };

  const handlePlayerTransferClick = (
    e: MouseEvent<HTMLButtonElement>,
    p: FullChangePlayer
  ) => {
    e.preventDefault();
    e.stopPropagation();
    onPlayerTransfer(p);
  };

  const handleSetCaptainClick = (
    e: MouseEvent<HTMLButtonElement>,
    p: FullChangePlayer
  ) => {
    e.preventDefault();
    e.stopPropagation();
    onSetCaptain(p);
  };

  const onSetViceCaptainClick = (
    e: MouseEvent<HTMLButtonElement>,
    p: FullChangePlayer
  ) => {
    e.preventDefault();
    e.stopPropagation();
    onSetViceCaptain(p);
  };

  const handleOutsideClick = () => {
    onCancel();
  };

  const handleKeyUp = (e: KeyboardEvent<HTMLDivElement>) => {
    if (e.key === "Escape") {
      onCancel();
    }
  };

  const handlePinnedBench = () => {
    setTeamPlannerPinnedBench(!teamPlannerPinnedBench);
    plausible("team-planner-pinned-bench", {
      props: { pinned: !teamPlannerPinnedBench },
    });
  };

  return (
    <Box height="100%" onKeyUp={handleKeyUp} onClick={handleOutsideClick}>
      <AutoSizer>
        {({ height, width }) => {
          return (
            <Box overflow="auto" height={`${height}px`} width={`${width}px`}>
              <SelectedTeamSection heading="Starting XI">
                {[GKP, DEF, MID, FWD].map((group, index) => {
                  return (
                    <Flex
                      key={index}
                      justifyContent="center"
                      alignItems="center"
                    >
                      {group.map((p) => (
                        <SwapablePlayer
                          key={p.id}
                          player={p}
                          variant={getVariant(selectedPlayer, p, teamObject)}
                          onSubstituteClick={(e) => handlePlayerSubClick(e, p)}
                          onTransferClick={(e) =>
                            handlePlayerTransferClick(e, p)
                          }
                          onSetCaptainClick={(e) => handleSetCaptainClick(e, p)}
                          onSetViceCaptainClick={(e) =>
                            onSetViceCaptainClick(e, p)
                          }
                        />
                      ))}
                    </Flex>
                  );
                })}
              </SelectedTeamSection>
              <Box
                position={teamPlannerPinnedBench ? "sticky" : undefined}
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
                      variant={teamPlannerPinnedBench ? "solid" : "ghost"}
                      onClick={handlePinnedBench}
                    />
                  }
                >
                  <Flex justifyContent="center" alignItems="center">
                    {bench.map((p) => (
                      <SwapablePlayer
                        key={p.id}
                        player={p}
                        variant={getVariant(selectedPlayer, p, teamObject)}
                        onSubstituteClick={(e) => handlePlayerSubClick(e, p)}
                        onTransferClick={(e) => handlePlayerTransferClick(e, p)}
                        onSetCaptainClick={(e) => handleSetCaptainClick(e, p)}
                        onSetViceCaptainClick={(e) =>
                          onSetViceCaptainClick(e, p)
                        }
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
