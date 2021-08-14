import { TableCellProps, TableRowProps, Tr } from "@chakra-ui/react";
import { ClientPlayer } from "@open-fpl/app/features/PlayerData/playerDataTypes";
import { PlayerTableConfig } from "@open-fpl/app/features/PlayerData/playerTableTypes";
import { getPaddedPastMatches } from "@open-fpl/app/features/PlayerData/PreviousStatsSection";
import { Fragment } from "react";

export const PlayersExplorerPlayerTableRow = ({
  cellProps,
  player,
  configs,
  ...props
}: TableRowProps & {
  cellProps?: TableCellProps;
  player: ClientPlayer;
  configs: PlayerTableConfig[];
}) => {
  const pastMatches = getPaddedPastMatches(player);
  return (
    <Tr {...props}>
      {configs?.map((config, index) => {
        return (
          <Fragment key={index}>
            {config.render({ player, config, pastMatches, cellProps })}
          </Fragment>
        );
      })}
    </Tr>
  );
};

export default PlayersExplorerPlayerTableRow;
