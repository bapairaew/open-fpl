import {
  Box,
  Flex,
  Icon,
  MenuDivider,
  MenuItemOption,
  MenuList,
  MenuOptionGroup,
  TableRowProps,
} from "@chakra-ui/react";
import TableCellWithMenu from "@open-fpl/app/features/Common/Table/TableCellWithMenu";
import {
  PlayerTableConfig,
  PlayerTableSortChangeHandler,
  PlayerTableSortColumnConfig,
} from "@open-fpl/app/features/PlayerData/playerTableTypes";
import { IoArrowDownOutline, IoArrowUpOutline } from "react-icons/io5";

export const PlayerTableHeaderRow = ({
  onSortChange,
  sortColumns,
  configs,
  ...props
}: {
  onSortChange?: PlayerTableSortChangeHandler;
  sortColumns?: PlayerTableSortColumnConfig[];
  configs?: PlayerTableConfig[];
} & TableRowProps) => {
  return (
    <Flex {...props}>
      {configs?.map((config) => {
        const key = config.header;

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
          <Box
            key={key}
            p={0}
            position="sticky"
            top={0}
            left={config.sticky ?? undefined}
            zIndex={2 + (config.sticky !== undefined ? 1 : 0)}
            textAlign="center"
          >
            <TableCellWithMenu
              px={4}
              width={`${config.columnWidth}px`}
              menuButtonProps={{
                "aria-label": `${config.header?.toLowerCase()} options`,
              }}
              menu={
                config.hideMenu ? undefined : (
                  <MenuList zIndex="modal">
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
                              aria-label={`unsort ${c.columnName?.toLowerCase()}`}
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
              {config.hideHeader ? "" : key}
              {arrow && (
                <Icon
                  aria-label={
                    sortDirection === "asc" ? "ascending" : "descending"
                  }
                  ml={1}
                  as={arrow!}
                />
              )}
            </TableCellWithMenu>
          </Box>
        );
      })}
    </Flex>
  );
};

export default PlayerTableHeaderRow;
