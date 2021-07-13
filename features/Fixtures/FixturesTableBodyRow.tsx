import { Box, Flex, Icon, Td, Tr } from "@chakra-ui/react";
import { IoReorderFourOutline } from "react-icons/io5";
import CompareTeamsPopover from "~/features/Fixtures/CompareTeamsPopover";
import { SortableFullTeamFixtures } from "~/features/Fixtures/fixturesDataTypes";
import TeamStrengthPopover from "~/features/Fixtures/TeamStrengthPopover";
import { difficultyColorCodes } from "~/features/RemoteData/fplColors";

const FixturesTableBodyRow = ({
  team,
  mode,
}: {
  team: SortableFullTeamFixtures;
  mode: string;
}) => {
  return (
    <Tr>
      <Td
        position="sticky"
        left={0}
        fontWeight="black"
        bgColor="white"
        textAlign="center"
        p={0}
      >
        <Flex
          className="handle"
          p={2}
          opacity={0.5}
          position="absolute"
          height="100%"
          alignItems="center"
          cursor="grab"
        >
          <Icon as={IoReorderFourOutline} />
        </Flex>
        <Box flexGrow={1}>
          <TeamStrengthPopover team={team}>
            {team.short_name}
          </TeamStrengthPopover>
        </Box>
      </Td>
      {team.fixtures.map((fixture) => {
        const difficulty =
          mode === "attack"
            ? fixture.attack_difficulty
            : fixture.defence_difficulty;
        const { background, text } = difficultyColorCodes[difficulty];
        return (
          <Td textAlign="center" bg={background} color={text} p={0}>
            <CompareTeamsPopover
              mode={mode}
              isHome={fixture.is_home}
              team={team}
              opponent={fixture.opponent}
            >
              {fixture.is_home
                ? fixture.opponent.short_name.toUpperCase()
                : fixture.opponent.short_name.toLocaleLowerCase()}
            </CompareTeamsPopover>
          </Td>
        );
      })}
    </Tr>
  );
};

export default FixturesTableBodyRow;
