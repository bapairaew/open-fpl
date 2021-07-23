import { Box, Flex, Icon, Td, Tr } from "@chakra-ui/react";
import { gameweeks } from "@open-fpl/app/features/Fixtures/fixturesData";
import { SortableFullTeamFixtures } from "@open-fpl/app/features/Fixtures/fixturesDataTypes";
import CompareTeamsPopover from "@open-fpl/app/features/TeamData/CompareTeamsPopover";
import TeamStrengthPopover from "@open-fpl/app/features/TeamData/TeamStrengthPopover";
import { difficultyColorCodes } from "@open-fpl/data/features/RemoteData/fplColors";
import { IoReorderFourOutline } from "react-icons/io5";

const FixturesTableRow = ({
  team,
  mode,
}: {
  team: SortableFullTeamFixtures;
  mode: string;
}) => {
  return (
    <Tr>
      <Td
        p={0}
        left={0}
        position="sticky"
        bgColor="white"
        textAlign="center"
        fontWeight="black"
      >
        <Flex
          className="handle"
          opacity={0.5}
          position="absolute"
          height="100%"
          alignItems="center"
          cursor="grab"
          p={2}
        >
          <Icon as={IoReorderFourOutline} />
        </Flex>
        <Box flexGrow={1}>
          <TeamStrengthPopover p={2} team={team}>
            {team.short_name}
          </TeamStrengthPopover>
        </Box>
      </Td>
      {gameweeks.map((gameweek) => {
        const fixtures = team.gameweeks[gameweek];
        return (
          <Td key={`${gameweek}`} p={0}>
            {fixtures?.map((fixture) => {
              const difficulty =
                mode === "attack"
                  ? fixture.attack_difficulty
                  : fixture.defence_difficulty;
              const { background, text } = difficultyColorCodes[difficulty];
              return (
                <CompareTeamsPopover
                  mode={mode}
                  isHome={fixture.is_home}
                  team={team}
                  opponent={fixture.opponent}
                  textAlign="center"
                  bg={background}
                  color={text}
                  height={`${40 / fixtures.length}px`}
                >
                  {fixture.is_home
                    ? fixture.opponent.short_name.toUpperCase()
                    : fixture.opponent.short_name.toLocaleLowerCase()}
                </CompareTeamsPopover>
              );
            })}
          </Td>
        );
      })}
    </Tr>
  );
};

export default FixturesTableRow;
