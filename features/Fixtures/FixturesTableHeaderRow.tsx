import {
  BoxProps,
  Flex,
  Icon,
  IconButton,
  Menu,
  MenuButton,
  MenuGroup,
  MenuItem,
  MenuList,
  Portal,
  Text,
  Th,
  Tr,
} from "@chakra-ui/react";
import { IoEllipsisVerticalOutline } from "react-icons/io5";

const CellWrapper = (props: BoxProps) => {
  return (
    <Flex px={4} py={3} alignItems="center" position="relative" {...props} />
  );
};

const OptionsMenuButton = () => {
  return (
    <MenuButton
      as={IconButton}
      right={0}
      position="absolute"
      size="xs"
      variant="ghost"
      aria-label="Options"
      icon={<Icon as={IoEllipsisVerticalOutline} />}
    />
  );
};

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
      <Th p={0} left={0} position="sticky" bgColor="white" textAlign="center">
        <CellWrapper width="140px">
          <Text flexGrow={1}>Team</Text>
          <Menu isLazy>
            {({ isOpen }) => {
              return (
                <>
                  <OptionsMenuButton />
                  {isOpen && (
                    <Portal>
                      <MenuList>
                        <MenuGroup title="Sorting">
                          <MenuItem onClick={onResetSortClick}>Reset</MenuItem>
                        </MenuGroup>
                      </MenuList>
                    </Portal>
                  )}
                </>
              );
            }}
          </Menu>
        </CellWrapper>
      </Th>
      {Array.from({ length: 38 }).map((_, i) => (
        <Th key={i} p={0} textAlign="center" bgColor="white">
          <CellWrapper width="120px">
            <Text flexGrow={1}>GW {i + 1}</Text>
            <Menu isLazy>
              {({ isOpen }) => {
                return (
                  <>
                    <OptionsMenuButton />
                    {isOpen && (
                      <Portal>
                        <MenuList>
                          <MenuGroup title="Sorting">
                            <MenuItem
                              onClick={() => onHardFixtureSortClick(i + 1)}
                            >
                              Hard fixtures first
                            </MenuItem>
                            <MenuItem
                              onClick={() => onEasyFixtureSortClick(i + 1)}
                            >
                              Easy fixtures first
                            </MenuItem>
                          </MenuGroup>
                        </MenuList>
                      </Portal>
                    )}
                  </>
                );
              }}
            </Menu>
          </CellWrapper>
        </Th>
      ))}
    </Tr>
  );
};

export default FixturesTableHeaderRow;
