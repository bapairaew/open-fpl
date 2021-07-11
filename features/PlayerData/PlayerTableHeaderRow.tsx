import {
  Icon,
  MenuDivider,
  MenuGroup,
  MenuItem,
  MenuList,
  Th,
  Tr,
  MenuOptionGroup,
  MenuItemOption,
} from "@chakra-ui/react";
import { MouseEvent } from "react";
import { IoArrowDownOutline, IoArrowUpOutline } from "react-icons/io5";
import TableCellWithMenu from "~/features/Common/TableCellWithMenu";
import { rowHeight, rowWidth } from "~/features/PlayerData/PlayerTable";
import playerTableConfigs from "~/features/PlayerData/playerTableConfigs";
import {
  PlayerTableColumn,
  PlayerTableSortChangeHandler,
  PlayerTableSortColumnConfig,
} from "~/features/PlayerData/playerTableTypes";

export const PlayerTableHeaderRow = ({
  onSortChange,
  sortColumns,
}: {
  onSortChange?: PlayerTableSortChangeHandler;
  sortColumns?: PlayerTableSortColumnConfig[];
}) => {
  return (
    <Tr height={`${rowHeight}px`} width={`${rowWidth}px`}>
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
                playerTableConfigs[key]?.hideMenu ? undefined : (
                  <MenuList>
                    <MenuOptionGroup
                      title="Sort"
                      type="radio"
                      value={sortDirection}
                      onChange={(direction: string | string[]) => {
                        if (direction === "asc" || direction === "desc") {
                          onSortChange?.(key, direction);
                        }
                      }}
                    >
                      <MenuItemOption value="asc">Ascending</MenuItemOption>
                      <MenuItemOption value="desc">Descending</MenuItemOption>
                    </MenuOptionGroup>
                    <MenuItem onClick={() => onSortChange?.(key, null)}>
                      Reset
                    </MenuItem>
                    {(sortColumns?.length ?? 0) > 0 && (
                      <>
                        <MenuDivider />
                        <MenuOptionGroup
                          title="Already Sorted by"
                          type="checkbox"
                          value={sortColumns?.map((c) => c.columnName)}
                          onChange={(selected: string | string[]) => {
                            if (typeof selected !== "string") {
                              const deselectedKey = sortColumns?.find(
                                (c) => !selected.includes(c.columnName)
                              );
                              if (deselectedKey) {
                                onSortChange?.(deselectedKey.columnName, null);
                              }
                            }
                          }}
                        >
                          {sortColumns?.map((c) => (
                            <MenuItemOption
                              key={c.columnName}
                              value={c.columnName}
                            >
                              {c.columnName} ({c.direction})
                            </MenuItemOption>
                          ))}
                        </MenuOptionGroup>
                      </>
                    )}
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
  );
};

export default PlayerTableHeaderRow;
