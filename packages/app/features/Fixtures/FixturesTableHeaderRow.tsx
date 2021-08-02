import {
  MenuDivider,
  MenuGroup,
  MenuItem,
  MenuList,
  Th,
  Tr,
  useColorMode,
} from "@chakra-ui/react";
import TableCellWithMenu from "@open-fpl/app/features/Common/TableCellWithMenu";
import { SortGroup } from "@open-fpl/app/features/Fixtures/FixturesTable";
import theme from "@open-fpl/common/theme";

const FixturesTableHeaderRow = ({
  onResetSortClick,
  onHardFixtureSortClick,
  onEasyFixtureSortClick,
  sortGroup,
  onHardSortGroupClick,
  onEasySortGroupClick,
  onResetSortGroupClick,
}: {
  onResetSortClick: () => void;
  onHardFixtureSortClick: (gameweek: number) => void;
  onEasyFixtureSortClick: (gameweek: number) => void;
  sortGroup: SortGroup;
  onHardSortGroupClick: (gameweek: number) => void;
  onEasySortGroupClick: (gameweek: number) => void;
  onResetSortGroupClick: () => void;
}) => {
  const { colorMode } = useColorMode();
  return (
    <Tr>
      <Th
        p={0}
        left={0}
        top={0}
        position="sticky"
        zIndex={2}
        bgColor={colorMode === "dark" ? "gray.800" : "white"}
        textAlign="center"
      >
        <TableCellWithMenu
          p={2}
          width="100px"
          menu={
            <MenuList zIndex="modal">
              <MenuGroup title="Sort">
                <MenuItem onClick={onResetSortClick}>Reset</MenuItem>
              </MenuGroup>
            </MenuList>
          }
        >
          Team
        </TableCellWithMenu>
      </Th>
      {Array.from({ length: 38 }).map((_, i) => (
        <Th
          key={i}
          p={0}
          top={0}
          position="sticky"
          bgColor={colorMode === "dark" ? "gray.800" : "white"}
          textAlign="center"
          color={sortGroup.group[0] === i + 1 ? "brand.500" : undefined}
          boxShadow={
            sortGroup.group[0] === i + 1
              ? `0 0 0 2px ${theme.colors.brand[500]} inset`
              : undefined
          }
        >
          <TableCellWithMenu
            p={2}
            width="100px"
            menu={
              <MenuList zIndex="modal">
                {sortGroup.group.length === 0 && (
                  <>
                    <MenuGroup title="Sort">
                      <MenuItem onClick={() => onEasyFixtureSortClick(i + 1)}>
                        Easy fixture first
                      </MenuItem>
                      <MenuItem onClick={() => onHardFixtureSortClick(i + 1)}>
                        Hard fixture first
                      </MenuItem>
                    </MenuGroup>
                    <MenuDivider />
                  </>
                )}
                {sortGroup.group.length > 0 ? (
                  <MenuGroup title="Group sort">
                    {sortGroup.direction === -1 && (
                      <MenuItem onClick={() => onEasySortGroupClick(i + 1)}>
                        Easy first from GW {sortGroup.group[0]} to here
                      </MenuItem>
                    )}
                    {sortGroup.direction === 1 && (
                      <MenuItem onClick={() => onHardSortGroupClick(i + 1)}>
                        Hard first from GW {sortGroup.group[0]} to here
                      </MenuItem>
                    )}
                    <MenuItem
                      color="red.600"
                      onClick={() => onResetSortGroupClick()}
                    >
                      Cancel
                    </MenuItem>
                  </MenuGroup>
                ) : (
                  <MenuGroup title="Group sort">
                    <MenuItem onClick={() => onEasySortGroupClick(i + 1)}>
                      Easy first from here...
                    </MenuItem>
                    <MenuItem onClick={() => onHardSortGroupClick(i + 1)}>
                      Hard first from here...
                    </MenuItem>
                  </MenuGroup>
                )}
              </MenuList>
            }
          >
            GW {i + 1}
          </TableCellWithMenu>
        </Th>
      ))}
    </Tr>
  );
};

export default FixturesTableHeaderRow;
