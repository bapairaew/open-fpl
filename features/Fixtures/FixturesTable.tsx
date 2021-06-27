import {
  Box,
  Flex,
  forwardRef,
  Icon,
  Table,
  TableBodyProps,
  Tbody,
  Td,
  Th,
  Thead,
  Tr,
} from "@chakra-ui/react";
import { useMemo } from "react";
import { IoReorderFourOutline } from "react-icons/io5";
import { ReactSortable } from "react-sortablejs";
import AutoSizer from "react-virtualized-auto-sizer";
import { difficultyColorCodes } from "~/features/AppData/fplColors";
import CompareTeamsPopover from "~/features/Fixtures/CompareTeamsPopover";
import { FullTeamFixtures } from "~/features/Fixtures/fixturesDataTypes";
import TeamStrengthPopover from "~/features/Fixtures/TeamStrengthPopover";

interface SortableFullTeamFixtures extends FullTeamFixtures {
  id: string;
}

const ForwardableTbody = forwardRef<TableBodyProps, "tbody">((props, ref) => {
  return <Tbody ref={ref}>{props.children}</Tbody>;
});

const FixturesTable = ({
  mode,
  fullFixtures,
  onFixturesOrderChange,
}: {
  mode: string;
  fullFixtures: FullTeamFixtures[];
  onFixturesOrderChange: (newOrder: string[]) => void;
}) => {
  const sortedFullFixtures = useMemo<SortableFullTeamFixtures[]>(() => {
    return fullFixtures.map((f) => ({ id: f.short_name, ...f }));
  }, [fullFixtures]);

  const handleOnFixturesOrderChange = (
    newOrder: SortableFullTeamFixtures[]
  ) => {
    onFixturesOrderChange(newOrder.map((f) => f.id));
  };

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
          <ReactSortable
            // TODO: Figure out how to satisfy the warning
            // @ts-ignore
            tag={ForwardableTbody}
            list={sortedFullFixtures}
            setList={handleOnFixturesOrderChange}
            handle=".handle"
          >
            {sortedFullFixtures.map((team) => (
              <Tr key={team.short_name}>
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
                      {/* TODO: perf issue */}
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
          </ReactSortable>
        </Table>
      )}
    </AutoSizer>
  );
};

export default FixturesTable;
