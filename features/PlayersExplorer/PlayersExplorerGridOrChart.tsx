import { Box, Grid, useBreakpointValue } from "@chakra-ui/react";
import { CSSProperties, MouseEvent, ReactNode, useMemo } from "react";
import AutoSizer from "react-virtualized-auto-sizer";
import { FixedSizeList as List } from "react-window";
import { Gameweek, Player } from "~/features/AppData/appDataTypes";
import PlayerChartCard from "~/features/PlayerData/PlayerChartCard";
import PlayerGridCard from "~/features/PlayerData/PlayerGridCard";
import PlayerCardToolbar from "~/features/PlayersExplorer/PlayerCardToolbar";

const PlayersExplorerGridOrChart = ({
  displayedPlayers,
  display,
  gameweeks,
  starredPlayers,
  onStarClick,
}: {
  displayedPlayers: Player[];
  display: string;
  gameweeks: Gameweek[];
  starredPlayers: number[] | null;
  onStarClick: (e: MouseEvent<HTMLButtonElement>, player: Player) => void;
}) => {
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
          const playerIndex = rowIndex * columnsCount + columnIndex;
          const player = displayedPlayers[playerIndex];
          if (player) {
            content.push(
              <PlayerCardToolbar
                player={player}
                isStarred={
                  starredPlayers?.some((p) => p === player.id) ?? false
                }
                onStarClick={(e) => onStarClick(e, player)}
              >
                {display === "chart" ? (
                  <PlayerChartCard player={player} />
                ) : (
                  <PlayerGridCard player={player} gameweeks={gameweeks} />
                )}
              </PlayerCardToolbar>
            );
          }
        }

        return (
          <div key={`${rowIndex}`} style={style}>
            <Grid
              templateColumns={`repeat(${columnsCount}, 1fr)`}
              gap={3}
              p={2}
              height="100%"
            >
              {content}
            </Grid>
          </div>
        );
      },
    [columnsCount, gameweeks, displayedPlayers, display, onStarClick]
  );

  return (
    <Box flexGrow={1}>
      <AutoSizer>
        {({ height, width }) => (
          <>
            <List
              height={height}
              width={width}
              itemSize={288}
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
