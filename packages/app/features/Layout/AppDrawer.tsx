import {
  Drawer,
  DrawerBody,
  DrawerCloseButton,
  DrawerContent,
  DrawerOverlay,
  Icon,
  IconButton,
  useDisclosure,
} from "@chakra-ui/react";
import SideBar from "@open-fpl/app/features/Navigation/SideBar";
import { createContext, ReactNode, useContext } from "react";
import { IoMenuOutline } from "react-icons/io5";

const AppDrawerContext = createContext<{
  onOpenAppDrawer: () => void;
}>({
  onOpenAppDrawer: () => {},
});

export const AppDrawerContexttProvider = ({
  children,
  ...props
}: {
  children: ReactNode;
}) => {
  const { isOpen, onOpen, onClose } = useDisclosure();

  return (
    <AppDrawerContext.Provider
      value={{
        onOpenAppDrawer: onOpen,
      }}
      {...props}
    >
      <Drawer size="md" placement="left" isOpen={isOpen} onClose={onClose}>
        <DrawerOverlay />
        <DrawerContent>
          <DrawerCloseButton />
          <DrawerBody p={0}>
            <SideBar />
          </DrawerBody>
        </DrawerContent>
      </Drawer>
      {children}
    </AppDrawerContext.Provider>
  );
};

export const useAppDrawer = () => useContext(AppDrawerContext);

export const AppDrawerOpenButton = () => {
  const { onOpenAppDrawer } = useAppDrawer();
  return (
    <IconButton
      variant="ghost"
      aria-label="menu"
      borderRadius="none"
      icon={<Icon as={IoMenuOutline} />}
      onClick={onOpenAppDrawer}
    />
  );
};
