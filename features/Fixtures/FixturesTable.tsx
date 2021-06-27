import { Box, Table, Tbody, Td, Th, Thead, Tr } from "@chakra-ui/react";
import AutoSizer from "react-virtualized-auto-sizer";
import { difficultyColorCodes } from "~/features/AppData/fplColors";
import CompareTeamsPopover from "~/features/Fixtures/CompareTeamsPopover";
import { FullTeamFixtures } from "~/features/Fixtures/fixturesDataTypes";
import TeamStrengthPopover from "~/features/Fixtures/TeamStrengthPopover";

const FixturesTable = ({
  mode,
  fullFixtures,
}: {
  mode: string;
  fullFixtures: FullTeamFixtures[];
}) => {
  return (
    <AutoSizer>
      {({ height, width }) => (
        <Table
          colorScheme="gray"
          display="block"
          overflow="auto"
          height={`${height - 50}px`}
          width={`${width}px`}
        >
          <Thead position="sticky" top={0} zIndex="sticky">
            <Tr>
              <Th position="sticky" left={0} bgColor="white" textAlign="center">
                <Box width="100px">Team</Box>
              </Th>
              {Array.from({ length: 38 }).map((_, i) => (
                <Th textAlign="center" key={i} bgColor="white">
                  <Box width="45px">GW {i + 1}</Box>
                </Th>
              ))}
            </Tr>
          </Thead>
          <Tbody>
            {fullFixtures.map((team) => (
              <Tr key={team.short_name}>
                <Td
                  position="sticky"
                  left={0}
                  fontWeight="black"
                  bgColor="white"
                  textAlign="center"
                  p={0}
                >
                  <TeamStrengthPopover team={team}>
                    {team.short_name}
                  </TeamStrengthPopover>
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
            ))}
          </Tbody>
        </Table>
      )}
    </AutoSizer>
  );
};

export default FixturesTable;
