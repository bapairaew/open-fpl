import { Box, Grid, useBreakpointValue } from "@chakra-ui/react";
import { CSSProperties, ReactNode, useMemo } from "react";
import AutoSizer from "react-virtualized-auto-sizer";
import { FixedSizeList as List } from "react-window";
import { Gameweek, Player } from "~/features/AppData/appDataTypes";
import PlayerChartCard from "~/features/PlayerData/PlayerChartCard";
import PlayerGridCard from "~/features/PlayerData/PlayerGridCard";

const PlayersExplorerGridOrChart = ({
  displayedPlayers,
  display,
  gameweeks,
}: {
  displayedPlayers: Player[];
  display: string;
  gameweeks: Gameweek[];
}) => {
  const itemSize = 260;
  const columnsCount =
    useBreakpointValue({
      xs: 1,
      sm: 1,
      md: 2,
      lg: 3,
      xl: 4,
      "2xl": 5,
    }) ?? 1;

  const row = useMemo(
    () =>
      ({ index: rowIndex, style }: { index: number; style: CSSProperties }) => {
        const content: ReactNode[] = [];
        for (let columnIndex = 0; columnIndex < columnsCount; columnIndex++) {
          const player =
            displayedPlayers[rowIndex * columnsCount + columnIndex];
          if (player) {
            content.push(
              <Box
                key={player.id}
                as="a"
                href={
                  player.linked_data?.understat_id
                    ? `https://understat.com/player/${player.linked_data.understat_id}`
                    : `https://understat.com/league/EPL`
                }
                target="_blank"
                rel="noreferrer noopener"
              >
                {display === "chart" ? (
                  <PlayerChartCard player={player} />
                ) : (
                  <PlayerGridCard player={player} gameweeks={gameweeks} />
                )}
              </Box>
            );
          }
        }

        return (
          <div key={`${rowIndex}`} style={style}>
            <Grid
              templateColumns={`repeat(${columnsCount}, 1fr)`}
              gap={2}
              p={1}
              height="100%"
            >
              {content}
            </Grid>
          </div>
        );
      },
    [gameweeks, displayedPlayers, columnsCount, display]
  );

  return (
    <Box flexGrow={1}>
      <AutoSizer>
        {({ height, width }) => (
          <>
            <List
              height={height}
              width={width}
              itemSize={itemSize}
              itemCount={Math.ceil(displayedPlayers.length / columnsCount)}
            >
              {row}
            </List>
          </>
        )}
      </AutoSizer>
    </Box>
  );
};

export default PlayersExplorerGridOrChart;
