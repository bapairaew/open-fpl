import { Box, BoxProps, Grid, useBreakpointValue } from "@chakra-ui/react";
import { CSSProperties, ReactNode, useMemo, useState } from "react";
import AutoSizer from "react-virtualized-auto-sizer";
import { FixedSizeList as List } from "react-window";
import { Gameweek, Player } from "~/features/AppData/appDataTypes";
import PlayerGridCard from "~/features/PlayerData/PlayerGridCard";
import PlayerChartCard from "~/features/PlayerData/PlayerChartCard";
import PlayersExplorerToolbar from "~/features/PlayersExplorer/PlayersExplorerToolbar";
import { displayOptions } from "./playersToolbarOptions";

const PlayersExplorer = ({
  players,
  gameweeks,
  ...props
}: BoxProps & {
  players: Player[];
  gameweeks: Gameweek[];
}) => {
  const [displayedPlayers, setDisplayedPlayers] = useState(players);
  const [display, setDisplay] = useState(displayOptions[0].value);
  const itemSize = display === "table" ? 30 : 260;
  const columnsCount =
    useBreakpointValue(
      display === "table"
        ? {
            xs: 1,
            sm: 1,
            md: 1,
            lg: 1,
            xl: 1,
            "2xl": 1,
          }
        : {
            xs: 1,
            sm: 1,
            md: 2,
            lg: 3,
            xl: 4,
            "2xl": 5,
          }
    ) ?? 1;

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
                {display === "table" ? (
                  player.web_name
                ) : display === "chart" ? (
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
              py={1}
              px={1}
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
    <Box overflow="hidden" height="100%" {...props}>
      <PlayersExplorerToolbar
        players={players}
        onSearchResults={setDisplayedPlayers}
        initialDisplay={display}
        onDisplayChange={setDisplay}
      />
      <AutoSizer>
        {({ height, width }) => (
          <List
            height={height - 50}
            width={width}
            itemSize={itemSize}
            itemCount={Math.ceil(displayedPlayers.length / columnsCount)}
          >
            {row}
          </List>
        )}
      </AutoSizer>
    </Box>
  );
};

export default PlayersExplorer;
