import {
  BoxProps,
  Flex,
  Icon,
  IconButton,
  Menu,
  MenuButton,
  MenuButtonProps,
  Portal,
  Text,
} from "@chakra-ui/react";
import { ReactNode } from "react";
import { IoEllipsisVerticalOutline } from "react-icons/io5";

const OptionsMenuButton = (props: MenuButtonProps) => {
  return (
    <MenuButton
      as={IconButton}
      right={1}
      position="absolute"
      size="xs"
      variant="ghost"
      icon={<Icon as={IoEllipsisVerticalOutline} />}
      aria-label="open menu"
      {...props}
    />
  );
};

const TableCellWithMenu = ({
  menu,
  children,
  menuButtonProps = {},
  ...props
}: BoxProps & { menu?: ReactNode; menuButtonProps?: MenuButtonProps }) => {
  return (
    <Flex alignItems="center" position="relative" {...props}>
      <Text flexGrow={1}>{children}</Text>
      {menu && (
        <Menu isLazy>
          {({ isOpen }) => {
            return (
              <>
                <OptionsMenuButton {...menuButtonProps} />
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
