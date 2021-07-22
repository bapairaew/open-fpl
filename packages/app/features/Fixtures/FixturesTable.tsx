import {
  forwardRef,
  Table,
  TableBodyProps,
  Tbody,
  Thead,
} from "@chakra-ui/react";
import {
  FullTeamFixtures,
  SortableFullTeamFixtures,
} from "@open-fpl/app/features/Fixtures/fixturesDataTypes";
import FixturesTableHeaderRow from "@open-fpl/app/features/Fixtures/FixturesTableHeaderRow";
import FixturesTableRow from "@open-fpl/app/features/Fixtures/FixturesTableRow";
import { useMemo, useState } from "react";
import { ReactSortable } from "react-sortablejs";
import AutoSizer from "react-virtualized-auto-sizer";

export interface SortGroup {
  direction: -1 | 1 | null;
  group: number[];
}

const ForwardableTbody = forwardRef<TableBodyProps, "tbody">((props, ref) => {
  return <Tbody ref={ref}>{props.children}</Tbody>;
});

interface SortableFullTeamFixturesWithDifficultySum
  extends SortableFullTeamFixtures {
  difficultySum: number;
}

const makeSortedFixturesOrder = (
  sortableFullFixtures: SortableFullTeamFixtures[],
  mode: string,
  gameweeks: number[],
  direction: -1 | 1
) => {
  const range = [Math.min(...gameweeks), Math.max(...gameweeks)];
  return [...sortableFullFixtures]
    .reduce((teams, team) => {
      return [
        ...teams,
        {
          ...team,
          difficultySum: team.fixtures
            .slice(range[0] - 1, range[1])
            .reduce((sum, fixture) => {
              return (
                sum +
                (mode === "attack"
                  ? fixture.attack_difficulty
                  : fixture.defence_difficulty)
              );
            }, 0),
        },
      ];
    }, [] as SortableFullTeamFixturesWithDifficultySum[])
    .sort((a, b) => {
      return a.difficultySum === b.difficultySum
        ? 0
        : a.difficultySum > b.difficultySum
        ? -1 * direction
        : 1 * direction;
    })
    .map((f) => f.id);
};

const FixturesTable = ({
  mode,
  fullFixtures,
  onFixturesOrderChange,
}: {
  mode: string;
  fullFixtures: FullTeamFixtures[];
  onFixturesOrderChange: (newOrder: string[] | null) => void;
}) => {
  const sortedFullFixtures = useMemo<SortableFullTeamFixtures[]>(() => {
    return fullFixtures.map((f) => ({ id: f.short_name, ...f }));
  }, [fullFixtures]);

  const [sortGroup, setSortGrouop] = useState<SortGroup>({
    direction: null,
    group: [],
  });

  const handleFixturesOrderChange = (newOrder: SortableFullTeamFixtures[]) =>
    onFixturesOrderChange(newOrder.map((f) => f.id));
  const handleResetSortClick = () => onFixturesOrderChange(null);
  const handleHardFixtureSortClick = (gameweek: number) =>
    onFixturesOrderChange(
      makeSortedFixturesOrder(sortedFullFixtures, mode, [gameweek], 1)
    );
  const handleEasyFixtureSortClick = (gameweek: number) =>
    onFixturesOrderChange(
      makeSortedFixturesOrder(sortedFullFixtures, mode, [gameweek], -1)
    );

  const handleHardSortGroupClick = (gameweek: number) => {
    if (sortGroup.group.length === 0) {
      setSortGrouop({
        direction: 1,
        group: [gameweek],
      });
    } else {
      onFixturesOrderChange(
        makeSortedFixturesOrder(
          sortedFullFixtures,
          mode,
          [...sortGroup.group, gameweek],
          1
        )
      );
      handleResetSortGroupClick();
    }
  };
  const handleEasySortGroupClick = (gameweek: number) => {
    if (sortGroup.group.length === 0) {
      setSortGrouop({
        direction: -1,
        group: [gameweek],
      });
    } else {
      onFixturesOrderChange(
        makeSortedFixturesOrder(
          sortedFullFixtures,
          mode,
          [...sortGroup.group, gameweek],
          -1
        )
      );
      handleResetSortGroupClick();
    }
  };
  const handleResetSortGroupClick = () => {
    setSortGrouop({
      direction: null,
      group: [],
    });
  };

  return (
    <AutoSizer>
      {({ height, width }) => (
        <Table
          colorScheme="gray"
          display="block"
          overflow="auto"
          height={`${height}px`}
          width={`${width}px`}
          size="sm"
        >
          <Thead position="sticky" top={0} zIndex="sticky">
            <FixturesTableHeaderRow
              onResetSortClick={handleResetSortClick}
              onHardFixtureSortClick={handleHardFixtureSortClick}
              onEasyFixtureSortClick={handleEasyFixtureSortClick}
              sortGroup={sortGroup}
              onHardSortGroupClick={handleHardSortGroupClick}
              onEasySortGroupClick={handleEasySortGroupClick}
              onResetSortGroupClick={handleResetSortGroupClick}
            />
          </Thead>
          <ReactSortable
            // NOTE: react-sortablejs typescript is not well-defined so just ignore it
            // @ts-ignore
            tag={ForwardableTbody}
            list={sortedFullFixtures}
            setList={handleFixturesOrderChange}
            handle=".handle"
          >
            {sortedFullFixtures.map((team) => (
              <FixturesTableRow key={team.short_name} team={team} mode={mode} />
            ))}
          </ReactSortable>
        </Table>
      )}
    </AutoSizer>
  );
};

export default FixturesTable;
