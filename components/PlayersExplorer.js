import { Box, Grid } from "@theme-ui/components";
import { useResponsiveValue } from "@theme-ui/match-media";
import { useMemo, useState } from "react";
import AutoSizer from "react-virtualized-auto-sizer";
import { FixedSizeList as List } from "react-window";
import PlayerCard from "~/components/PlayerCard";
import PlayerSearchBar, {
  SEARCH_BAR_HEIGHT,
} from "~/components/PlayerSearchBar";

const PlayersExplorer = ({ players, gameweeks, columnsSettings }) => {
  const columnsCount = useResponsiveValue(columnsSettings);
  const [displayedPlayers, setDisplayedPlayers] = useState(players);

  const Row = useMemo(
    () =>
      ({ index: rowIndex, style }) => {
        const content = [];
        for (let columnIndex = 0; columnIndex < columnsCount; columnIndex++) {
          const player =
            displayedPlayers[rowIndex * columnsCount + columnIndex];
          if (player) {
            content.push(
              <Box
                key={player.id}
                as="a"
                href={
                  player.understat_id
                    ? `https://understat.com/player/${player.understat_id}`
                    : `https://understat.com/league/EPL`
                }
                target="_blank"
                rel="noreferrer noopener"
                sx={{
                  textDecoration: "inherit",
                  color: "inherit",
                }}
              >
                <PlayerCard player={player} gameweeks={gameweeks} />
              </Box>
            );
          }
        }

        return (
          <div key={`${rowIndex}`} style={style}>
            <Grid
              columns={columnsSettings}
              gap={2}
              py={1}
              px={1}
              sx={{ height: "100%" }}
            >
              {content}
            </Grid>
          </div>
        );
      },
    [displayedPlayers, gameweeks, columnsCount]
  );

  return (
    <>
      <PlayerSearchBar onResults={setDisplayedPlayers} players={players} />
      <AutoSizer>
        {({ height, width }) => (
          <List
            height={height - SEARCH_BAR_HEIGHT}
            itemCount={Math.ceil(displayedPlayers.length / columnsCount)}
            itemSize={255}
            width={width}
          >
            {Row}
          </List>
        )}
      </AutoSizer>
    </>
  );
};

export default PlayersExplorer;
