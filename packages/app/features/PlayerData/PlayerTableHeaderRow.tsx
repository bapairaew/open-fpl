import {
  Icon,
  MenuDivider,
  MenuItemOption,
  MenuList,
  MenuOptionGroup,
  Th,
  Tr,
} from "@chakra-ui/react";
import { IoArrowDownOutline, IoArrowUpOutline } from "react-icons/io5";
import TableCellWithMenu from "@open-fpl/app/features/Common/TableCellWithMenu";
import {
  rowHeight,
  rowWidth,
} from "@open-fpl/app/features/PlayerData/PlayerTable";
import playerTableConfigs from "@open-fpl/app/features/PlayerData/playerTableConfigs";
import {
  PlayerTableColumn,
  PlayerTableSortChangeHandler,
  PlayerTableSortColumnConfig,
} from "@open-fpl/app/features/PlayerData/playerTableTypes";

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
            left={playerTableConfigs[key]?.sticky ?? 0}
            zIndex="sticky"
            bgColor="white"
            textAlign="center"
            position={
              playerTableConfigs[key]?.sticky !== undefined
                ? "sticky"
                : "static"
            }
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
                      <MenuItemOption value="desc">Descending</MenuItemOption>
                      <MenuItemOption value="asc">Ascending</MenuItemOption>
                    </MenuOptionGroup>
                    {(sortColumns?.length ?? 0) > 0 && (
                      <>
                        <MenuDivider />
                        <MenuOptionGroup
                          title="Currently sorted by"
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
