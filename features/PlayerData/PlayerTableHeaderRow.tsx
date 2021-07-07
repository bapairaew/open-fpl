import {
  Icon,
  MenuDivider,
  MenuGroup,
  MenuItem,
  MenuList,
  Th,
  Thead,
  Tr,
} from "@chakra-ui/react";
import { MouseEvent } from "react";
import { IoArrowDownOutline, IoArrowUpOutline } from "react-icons/io5";
import TableCellWithMenu from "~/features/Common/TableCellWithMenu";
import { rowHeight, rowWidth } from "~/features/PlayerData/PlayerTable";
import playerTableConfigs from "~/features/PlayerData/playerTableConfigs";
import {
  PlayerTableColumn,
  PlayerTableSortClickType,
  PlayerTableSortColumnConfig,
} from "~/features/PlayerData/playerTableTypes";

export const PlayerTableHeaderRow = ({
  onSortClick,
  sortColumns,
}: {
  onSortClick?: PlayerTableSortClickType;
  sortColumns?: PlayerTableSortColumnConfig[];
}) => {
  return (
    <Thead
      height={`${rowHeight}px`}
      width={`${rowWidth}px`}
      top={0}
      position="sticky"
      zIndex="sticky"
    >
      <Tr>
        {Object.keys(playerTableConfigs).map((objectKey: string) => {
          const key = objectKey as PlayerTableColumn;
          const sortDirection = sortColumns?.find(
            (c) => c.columnName === key
          )?.direction;
          const arrow =
            sortDirection === "asc"
              ? IoArrowUpOutline
              : sortDirection === "desc"
              ? IoArrowDownOutline
              : null;
          return (
            <Th
              key={key}
              p={0}
              left={0}
              zIndex="sticky"
              bgColor="white"
              textAlign="center"
              position={playerTableConfigs[key]?.sticky ? "sticky" : "static"}
            >
              <TableCellWithMenu
                px={4}
                width={`${playerTableConfigs[key].columnWidth}px`}
                menu={
                  playerTableConfigs[key]?.hideHeader ? undefined : (
                    <MenuList>
                      <MenuGroup title="Sort">
                        <MenuItem
                          onClick={(e: MouseEvent<HTMLButtonElement>) =>
                            onSortClick?.(e, key, "asc")
                          }
                        >
                          Ascending
                        </MenuItem>
                        <MenuItem
                          onClick={(e: MouseEvent<HTMLButtonElement>) =>
                            onSortClick?.(e, key, "desc")
                          }
                        >
                          Descending
                        </MenuItem>
                        <MenuDivider />
                        <MenuItem
                          onClick={(e: MouseEvent<HTMLButtonElement>) =>
                            onSortClick?.(e, key, null)
                          }
                        >
                          Reset
                        </MenuItem>
                      </MenuGroup>
                    </MenuList>
                  )
                }
              >
                {playerTableConfigs[key]?.hideHeader ? "" : key}
                {arrow && <Icon ml={1} as={arrow!} />}
              </TableCellWithMenu>
            </Th>
          );
        })}
      </Tr>
    </Thead>
  );
};

export default PlayerTableHeaderRow;
