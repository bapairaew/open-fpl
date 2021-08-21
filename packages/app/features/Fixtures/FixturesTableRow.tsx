import { Box, Flex, Icon, Td, Th, Tr } from "@chakra-ui/react";
import { SortableFullTeamFixtures } from "@open-fpl/app/features/Fixtures/fixturesDataTypes";
import CompareTeamsPopover from "@open-fpl/app/features/TeamData/CompareTeamsPopover";
import TeamStrengthPopover from "@open-fpl/app/features/TeamData/TeamStrengthPopover";
import { IoReorderFourOutline } from "react-icons/io5";

const gameweeks = Array.from({ length: 38 }, (_, i) => i + 1);

const FixturesTableRow = ({
  team,
  mode,
  nextGameweekId,
}: {
  team: SortableFullTeamFixtures;
  mode: string;
  nextGameweekId: number;
}) => {
  return (
    <Tr>
      <Th
        p={0}
        left={0}
        zIndex={1}
        position="sticky"
        textAlign="center"
        fontWeight="black"
        borderBottomWidth={1}
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
      </Th>
      {gameweeks.map((gameweek) => {
        const fixtures = team.gameweeks[gameweek];
        return (
          <Td
            key={`${gameweek}`}
            p={0}
            zIndex={0}
            opacity={gameweek < nextGameweekId ? 0.5 : 1}
          >
            {fixtures?.map((fixture) => {
              const difficulty =
                mode === "attack"
                  ? fixture.attack_difficulty
                  : fixture.defence_difficulty;
              return (
                <CompareTeamsPopover
                  key={fixture.opponent.short_name}
                  mode={mode}
                  isHome={fixture.is_home}
                  team={team}
                  opponent={fixture.opponent}
                  textAlign="center"
                  height={`${40 / fixtures.length}px`}
                  layerStyle={`fpl-difficulty-${difficulty}`}
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
