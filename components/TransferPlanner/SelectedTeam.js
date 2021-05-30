import { Box, Flex, Heading, Icon, IconButton } from "@chakra-ui/react";
import { AiOutlinePushpin } from "react-icons/ai";
import AutoSizer from "react-virtualized-auto-sizer";
import PlayerCard from "~/components/PlayerCard/PlayerCard";
import { isSwapable } from "~/components/TransferPlanner/changes";
import { useUser } from "~/components/User/UserContext";

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

const teamPlayerVariants = {
  default: {
    cursor: "pointer",
    _hover: {
      boxShadow: "md",
    },
  },
  selected: {
    cursor: "pointer",
    bg: "highlight",
    boxShadow: "lg",
  },
  swapable: {
    cursor: "pointer",
  },
  disabled: {
    opacity: 0.1,
  },
};

const TeamPlayer = ({ children, variant, onClick }) => {
  const variantProps = teamPlayerVariants[variant] ?? varaints.default;
  return (
    <Box
      p={1}
      flexBasis="200px"
      borderRadius="md"
      transition="all 300ms"
      onClick={onClick}
      {...variantProps}
    >
      {children}
    </Box>
  );
};

const SelectedTeamRow = ({ children }) => {
  return (
    <Flex justifyContent="center" alignItems="center">
      {children}
    </Flex>
  );
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
}) => {
  const { transferPlannerPinnedBench, setTransferPlannerPinnedBench } =
    useUser();
  const benchProps = transferPlannerPinnedBench
    ? { position: "sticky", bottom: 0 }
    : {};
  const { GKP, DEF, MID, FWD, bench } = teamObject;

  return (
    <Box height="100%">
      <AutoSizer>
        {({ height, width }) => {
          return (
            <Box overflow="auto" height={`${height}px`} width={`${width}px`}>
              <SelectedTeamSection heading="Starting XI" height="740px">
                {[GKP, DEF, MID, FWD].map((group, index) => {
                  return (
                    <SelectedTeamRow key={index}>
                      {group.map((p) => (
                        <TeamPlayer
                          key={p.id}
                          onClick={() => onPlayerClick(p)}
                          variant={getVariant(selectedPlayer, p, teamObject)}
                        >
                          <PlayerCard mini player={p} gameweeks={gameweeks} />
                        </TeamPlayer>
                      ))}
                    </SelectedTeamRow>
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
                  <SelectedTeamRow>
                    {bench.map((p) => (
                      <TeamPlayer
                        key={p.id}
                        onClick={() => onPlayerClick(p)}
                        variant={getVariant(selectedPlayer, p, teamObject)}
                      >
                        <PlayerCard mini player={p} gameweeks={gameweeks} />
                      </TeamPlayer>
                    ))}
                  </SelectedTeamRow>
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
