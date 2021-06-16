import { Box, Grid, useBreakpointValue } from "@chakra-ui/react";
import { CSSProperties, ReactNode, useMemo, useState } from "react";
import AutoSizer from "react-virtualized-auto-sizer";
import { FixedSizeList as List } from "react-window";
import PlayerCard from "~/features/PlayerCard/PlayerCard";
import PlayerSearchBar from "~/features/PlayersExplorer/PlayerSearchBar";
import { Gameweek, Player } from "~/features/AppData/appDataTypes";

const PlayersExplorer = ({
  players,
  gameweeks,
  columnsSettings,
}: {
  players: Player[];
  gameweeks: Gameweek[];
  columnsSettings: Record<string, number>;
}) => {
  const columnsCount = useBreakpointValue(columnsSettings);
  const [displayedPlayers, setDisplayedPlayers] = useState(players);

  const Row = useMemo(
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
                <PlayerCard player={player} gameweeks={gameweeks} />
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
    [displayedPlayers, gameweeks, columnsCount]
  );

  return (
    <Box overflow="hidden" height="100%">
      <Box px={4} py={2}>
        <PlayerSearchBar onResults={setDisplayedPlayers} players={players} />
      </Box>
      <AutoSizer>
        {({ height, width }) => (
          <List
            height={height - 55}
            width={width}
            itemCount={Math.ceil(displayedPlayers.length / columnsCount)}
            itemSize={260}
          >
            {Row}
          </List>
        )}
      </AutoSizer>
    </Box>
  );
};

export default PlayersExplorer;
