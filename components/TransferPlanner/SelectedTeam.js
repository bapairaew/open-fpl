import { Box, Flex, Heading, Icon, IconButton } from "@chakra-ui/react";
import { AiOutlinePushpin } from "react-icons/ai";
import AutoSizer from "react-virtualized-auto-sizer";
import PlayerCard from "~/components/PlayerCard/PlayerCard";
import { useSettings } from "~/components/Settings/SettingsContext";
import { isSwapable } from "~/components/TransferPlanner/changes";
import TransferablePlayer from "~/components/TransferPlanner/TransferablePlayer";

const getVariant = (selectedPlayer, targetPlayer, teamObject) => {
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
}) => {
  return (
    <>
      <Flex
        px={4}
        py={2}
        bg="white"
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
  onPlayerClick,
  onOutsideClick,
}) => {
  const { transferPlannerPinnedBench, setTransferPlannerPinnedBench } =
    useSettings();

  const benchProps = transferPlannerPinnedBench
    ? { position: "sticky", bottom: 0 }
    : {};

  const { GKP, DEF, MID, FWD, bench } = teamObject;

  const makeHandlePlayerClick = (p) => (e) => {
    e.preventDefault();
    e.stopPropagation();
    onPlayerClick(p);
  };

  return (
    <Box height="100%" onClick={onOutsideClick}>
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
                          onClick={makeHandlePlayerClick(p)}
                          variant={getVariant(selectedPlayer, p, teamObject)}
                        >
                          <PlayerCard mini player={p} gameweeks={gameweeks} />
                        </TransferablePlayer>
                      ))}
                    </Flex>
                  );
                })}
              </SelectedTeamSection>
              <Box borderTopWidth={1} bg="white" {...benchProps}>
                <SelectedTeamSection
                  heading="Bench"
                  headingRightAddon={
                    <IconButton
                      size="xs"
                      aria-label="pin bench"
                      icon={<Icon as={AiOutlinePushpin} />}
                      variant={transferPlannerPinnedBench ? "solid" : "ghost"}
                      onClick={() =>
                        setTransferPlannerPinnedBench(
                          !transferPlannerPinnedBench
                        )
                      }
                    />
                  }
                  height="200px"
                >
                  <Flex justifyContent="center" alignItems="center">
                    {bench.map((p) => (
                      <TransferablePlayer
                        key={p.id}
                        onClick={makeHandlePlayerClick(p)}
                        variant={getVariant(selectedPlayer, p, teamObject)}
                      >
                        <PlayerCard mini player={p} gameweeks={gameweeks} />
                      </TransferablePlayer>
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
