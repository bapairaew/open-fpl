import {
  BoxProps,
  Flex,
  Icon,
  IconButton,
  Menu,
  MenuButton,
  Portal,
  Text,
} from "@chakra-ui/react";
import { ReactNode } from "react";
import { IoEllipsisVerticalOutline } from "react-icons/io5";

const OptionsMenuButton = () => {
  return (
    <MenuButton
      as={IconButton}
      right={1}
      position="absolute"
      size="xs"
      variant="ghost"
      aria-label="Options"
      icon={<Icon as={IoEllipsisVerticalOutline} />}
    />
  );
};

const TableCellWithMenu = ({
  menu,
  children,
  ...props
}: BoxProps & { menu?: ReactNode }) => {
  return (
    <Flex alignItems="center" position="relative" {...props}>
      <Text flexGrow={1}>{children}</Text>
      {menu && (
        <Menu isLazy>
          {({ isOpen }) => {
            return (
              <>
                <OptionsMenuButton />
                {isOpen && <Portal>{menu}</Portal>}
              </>
            );
          }}
        </Menu>
      )}
    </Flex>
  );
};

export default TableCellWithMenu;
