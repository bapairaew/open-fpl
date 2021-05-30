import { Box } from "@chakra-ui/react";
import { useMemo, useState } from "react";
import AutoSizer from "react-virtualized-auto-sizer";
import { FixedSizeList as List } from "react-window";
import PlayerCard from "~/components/PlayerCard/PlayerCard";
import PlayerSearchBar from "~/components/PlayersExplorer/PlayerSearchBar";

const TransferMarket = ({ team, players, gameweeks, onPlayerClick }) => {
  const [displayedPlayers, setDisplayedPlayers] = useState(players);

  const Row = useMemo(
    () =>
      ({ index, style }) => {
        const player = displayedPlayers[index];
        const isInTeam = team.some((p) => p.id === player.id);

        return (
          <div
            key={`${index}`}
            style={{
              ...style,
              cursor: isInTeam ? "not-allowed" : "pointer",
              opacity: isInTeam ? 0.5 : 1,
              pointerEvents: isInTeam ? "none" : "inherit",
            }}
            onClick={() => onPlayerClick(player)}
          >
            <PlayerCard mini player={player} gameweeks={gameweeks} />
          </div>
        );
      },
    [displayedPlayers, gameweeks]
  );

  return (
    <>
      <Box p={2}>
        <PlayerSearchBar
          onResults={setDisplayedPlayers}
          players={players}
          direction="column"
        />
      </Box>
      {displayedPlayers.length === 0 ? (
        <Box py={10} textAlign="center" color="gray">
          No players found
        </Box>
      ) : (
        <Box px={2} height="100%">
          <AutoSizer>
            {({ height, width }) => (
              <List
                height={height - 100}
                width={width}
                itemCount={Math.ceil(displayedPlayers.length)}
                itemSize={170}
              >
                {Row}
              </List>
            )}
          </AutoSizer>
        </Box>
      )}
    </>
  );
};

export default TransferMarket;
