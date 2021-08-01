import { ClientPlayer } from "@open-fpl/app/features/PlayerData/playerDataTypes";
import playersSortFunctions from "@open-fpl/app/features/PlayerData/playersSortFunctions";
import {
  PlayerTableConfig,
  PlayerTableSortColumnConfig,
} from "@open-fpl/app/features/PlayerData/playerTableTypes";

const sortPlayerTable = (
  players: ClientPlayer[],
  sortColumns: PlayerTableSortColumnConfig[],
  configs: PlayerTableConfig[]
): ClientPlayer[] => {
  return [...players].sort((a, b) => {
    // always show starred players first
    let sortResult = playersSortFunctions.starred(a, b);

    if (sortResult === 0) {
      for (const column of sortColumns) {
        sortResult =
          column.direction === "desc"
            ? configs
                .find((c) => c.header === column.columnName)
                ?.sortFn?.(a, b) ?? 0
            : configs
                .find((c) => c.header === column.columnName)
                ?.reversedSortFn?.(a, b) ?? 0;
        if (sortResult !== 0) {
          // break early if we have a non-zero sort result
          break;
        }
      }
    }

    if (sortResult === 0)
      // if we didn't find a sort result, use the default sort order
      sortResult =
        configs.find((c) => c.header === "Cost")?.reversedSortFn?.(a, b) ?? 0;
    return sortResult;
  });
};

export default sortPlayerTable;
