import { MenuGroup, MenuItem, MenuList, Th, Tr } from "@chakra-ui/react";
import TableCellWithMenu from "~/features/Common/TableCellWithMenu";

const FixturesTableHeaderRow = ({
  onResetSortClick,
  onHardFixtureSortClick,
  onEasyFixtureSortClick,
}: {
  onResetSortClick: () => void;
  onHardFixtureSortClick: (gameweek: number) => void;
  onEasyFixtureSortClick: (gameweek: number) => void;
}) => {
  return (
    <Tr>
      <Th
        p={0}
        left={0}
        position="sticky"
        zIndex="sticky"
        bgColor="white"
        textAlign="center"
      >
        <TableCellWithMenu
          width="140px"
          px={4}
          py={3}
          menu={
            <MenuList>
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
        <Th key={i} p={0} textAlign="center" bgColor="white">
          <TableCellWithMenu
            width="130px"
            px={4}
            py={3}
            menu={
              <MenuList>
                <MenuGroup title="Sort">
                  <MenuItem onClick={() => onHardFixtureSortClick(i + 1)}>
                    Hard fixtures first
                  </MenuItem>
                  <MenuItem onClick={() => onEasyFixtureSortClick(i + 1)}>
                    Easy fixtures first
                  </MenuItem>
                </MenuGroup>
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
