import { TableRowProps, Tr } from "@chakra-ui/react";
import { ClientPlayer } from "@open-fpl/app/features/PlayerData/playerDataTypes";
import { PlayerTableConfig } from "@open-fpl/app/features/PlayerData/playerTableTypes";
import { getPaddedPastMatches } from "@open-fpl/app/features/PlayerData/PreviousStatsSection";

export const PlayersExplorerPlayerTableRow = ({
  player,
  configs,
  ...props
}: TableRowProps & {
  player: ClientPlayer;
  configs: PlayerTableConfig[];
}) => {
  const pastMatches = getPaddedPastMatches(player);
  return (
    <Tr {...props}>
      {configs?.map((config) => {
        return config.render({ player, config, pastMatches });
      })}
    </Tr>
  );
};

export default PlayersExplorerPlayerTableRow;
