import { Box, Flex, Icon, Td, Tr } from "@chakra-ui/react";
import { IoReorderFourOutline } from "react-icons/io5";
import CompareTeamsPopover from "~/features/Fixtures/CompareTeamsPopover";
import { SortableFullTeamFixtures } from "~/features/Fixtures/fixturesDataTypes";
import TeamStrengthPopover from "~/features/Fixtures/TeamStrengthPopover";
import { difficultyColorCodes } from "~/features/RemoteData/fplColors";

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
      {team.fixtures.map((fixture, index) => {
        const difficulty =
          mode === "attack"
            ? fixture.attack_difficulty
            : fixture.defence_difficulty;
        const { background, text } = difficultyColorCodes[difficulty];
        return (
          <Td
            key={`${index}`}
            p={0}
            textAlign="center"
            bg={background}
            color={text}
          >
            <CompareTeamsPopover
              p={2}
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

export default FixturesTableRow;
