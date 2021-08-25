import { Box, BoxProps, Grid, useBreakpointValue } from "@chakra-ui/react";
import PlayerChartCard from "@open-fpl/app/features/PlayerData/PlayerChartCard";
import { ClientPlayer } from "@open-fpl/app/features/PlayerData/playerDataTypes";
import PlayerGridCard from "@open-fpl/app/features/PlayerData/PlayerGridCard";
import PlayerCardToolbar from "@open-fpl/app/features/PlayersExplorer/PlayerCardToolbar";
import {
  ChangeEvent,
  CSSProperties,
  MouseEvent,
  ReactNode,
  useMemo,
} from "react";
import AutoSizer from "react-virtualized-auto-sizer";
import { FixedSizeList as List } from "react-window";

const PlayersExplorerGridOrChart = ({
  displayedPlayers,
  display,
  selectedPlayers,
  onSelectChange,
  onStarClick,
  ...props
}: BoxProps & {
  displayedPlayers: ClientPlayer[];
  display: string;
  selectedPlayers: ClientPlayer[];
  onSelectChange: (
    e: ChangeEvent<HTMLInputElement>,
    player: ClientPlayer
  ) => void;
  onStarClick: (e: MouseEvent<HTMLButtonElement>, player: ClientPlayer) => void;
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
                key={player.id}
                m={1}
                aria-label="player statistics"
                role="listitem"
                player={player}
                isSelected={selectedPlayers.some((p) => p.id === player.id)}
                onSelectChange={(e) => onSelectChange(e, player)}
                isStarred={player.client_data.starred_index > -1}
                onStarClick={(e) => onStarClick(e, player)}
              >
                {display === "chart" ? (
                  <PlayerChartCard player={player} />
                ) : (
                  <PlayerGridCard player={player} />
                )}
              </PlayerCardToolbar>
            );
          }
        }

        return (
          <div key={`${rowIndex}`} style={style}>
            <Grid
              gap={0}
              templateColumns={`repeat(${columnsCount}, ${Math.floor(
                100 / columnsCount
              )}%)`}
              p={1}
              height="100%"
            >
              {content}
            </Grid>
          </div>
        );
      },
    [columnsCount, displayedPlayers, display, selectedPlayers, onStarClick]
  );

  return (
    <Box flexGrow={1} role="list" aria-label="players list" {...props}>
      <AutoSizer>
        {({ height, width }) => (
          <>
            <List
              height={height}
              width={width}
              itemSize={240}
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
