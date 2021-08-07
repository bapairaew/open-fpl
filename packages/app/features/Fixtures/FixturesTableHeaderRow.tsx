import {
  Divider,
  MenuDivider,
  MenuGroup,
  MenuItem,
  MenuList,
  Th,
  Tr,
} from "@chakra-ui/react";
import TableCellWithMenu from "@open-fpl/app/features/Common/Table/TableCellWithMenu";
import { SortGroup } from "@open-fpl/app/features/Fixtures/FixturesTable";

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
  return (
    <Tr>
      <Th
        p={0}
        left={0}
        top={0}
        position="sticky"
        zIndex={2}
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
          textAlign="center"
          layerStyle={sortGroup.group[0] === i + 1 ? "selected" : undefined}
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
                    <Divider />
                    <MenuItem onClick={() => onResetSortGroupClick()}>
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
