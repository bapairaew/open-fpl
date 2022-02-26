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
  sortGroup,
  onResetSortClick,
  onHardFixtureSortClick,
  onEasyFixtureSortClick,
  onHardRangeSortClick,
  onEasyRangeSortClick,
  onResetRangeSortClick,
}: {
  sortGroup: SortGroup;
  onResetSortClick: () => void;
  onHardFixtureSortClick: (gameweek: number) => void;
  onEasyFixtureSortClick: (gameweek: number) => void;
  onHardRangeSortClick: (gameweek: number) => void;
  onEasyRangeSortClick: (gameweek: number) => void;
  onResetRangeSortClick: () => void;
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
          aria-label={`gameweek ${i + 1}`}
          p={0}
          top={0}
          position="sticky"
          zIndex={1}
          textAlign="center"
          layerStyle={sortGroup.group[0] === i + 1 ? "selected" : undefined}
        >
          <TableCellWithMenu
            p={2}
            width="100px"
            menuButtonProps={{
              "aria-label": `gameweek ${i + 1} sort options`,
            }}
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
                  <MenuGroup title="Range sort">
                    {sortGroup.direction === -1 && (
                      <MenuItem onClick={() => onEasyRangeSortClick(i + 1)}>
                        Easy first from GW {sortGroup.group[0]} to here
                      </MenuItem>
                    )}
                    {sortGroup.direction === 1 && (
                      <MenuItem onClick={() => onHardRangeSortClick(i + 1)}>
                        Hard first from GW {sortGroup.group[0]} to here
                      </MenuItem>
                    )}
                    <Divider />
                    <MenuItem onClick={() => onResetRangeSortClick()}>
                      Cancel
                    </MenuItem>
                  </MenuGroup>
                ) : (
                  <MenuGroup title="Range sort">
                    <MenuItem onClick={() => onEasyRangeSortClick(i + 1)}>
                      Easy first from here...
                    </MenuItem>
                    <MenuItem onClick={() => onHardRangeSortClick(i + 1)}>
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
