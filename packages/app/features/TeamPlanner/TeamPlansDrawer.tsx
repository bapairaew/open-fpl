import {
  Box,
  BoxProps,
  Button,
  Divider,
  Drawer,
  DrawerBody,
  DrawerCloseButton,
  DrawerContent,
  DrawerHeader,
  DrawerOverlay,
  Flex,
  forwardRef,
  HStack,
  Icon,
  IconButton,
  Menu,
  MenuButton,
  MenuDivider,
  MenuItem,
  MenuList,
  Portal,
  Radio,
  RadioGroup,
  Text,
  useDisclosure,
  VStack,
} from "@chakra-ui/react";
import RemovePlanCofirmModal from "@open-fpl/app/features/TeamPlanner/RemovePlanCofirmModal";
import RenamePlanModal from "@open-fpl/app/features/TeamPlanner/RenamePlanModal";
import { useState } from "react";
import {
  IoAddOutline,
  IoEllipsisVerticalOutline,
  IoReorderFourOutline,
} from "react-icons/io5";
import { ItemInterface, ReactSortable } from "react-sortablejs";

const ForwardableVStack = forwardRef<BoxProps, "div">((props, ref) => {
  return (
    <VStack ref={ref} alignItems="flex-start" spacing={4}>
      {props.children}
    </VStack>
  );
});

const TeamPlansDrawer = ({
  isOpen,
  onClose,
  teamPlans,
  selectedIndex,
  onSelectedIndexChange,
  onAdd,
  onRename,
  onDuplicate,
  onRemove,
  onRearrange,
}: {
  isOpen: boolean;
  onClose: () => void;
  teamPlans: ItemInterface[];
  selectedIndex: number;
  onSelectedIndexChange: (index: number) => void;
  onAdd: () => void;
  onRename: (newName: string, oldName: string) => void;
  onDuplicate: (plan: string) => void;
  onRemove: (plan: string) => void;
  onRearrange: (newOrder: ItemInterface[]) => void;
}) => {
  const {
    isOpen: isConfirmRemoveOpen,
    onOpen: onConfirmRemoveOpen,
    onClose: onConfirmRemoveClose,
  } = useDisclosure();

  const {
    isOpen: isRenameOpen,
    onOpen: onRenameOpen,
    onClose: onRenameClose,
  } = useDisclosure();

  const [selectedPlan, setSelectedPlan] = useState("");

  const handleRemoveClick = (plan: string) => {
    setSelectedPlan(plan);
    onConfirmRemoveOpen();
  };

  const handleCofirmRemove = () => {
    onConfirmRemoveClose();
    onRemove(selectedPlan);
    setSelectedPlan("");
  };

  const handleRenameClick = (plan: string) => {
    setSelectedPlan(plan);
    onRenameOpen();
  };

  const handleRenameConfirm = (name: string) => {
    onRenameClose();
    onRename(name, selectedPlan);
    setSelectedPlan("");
  };

  return (
    <>
      {isConfirmRemoveOpen && (
        <RemovePlanCofirmModal
          isOpen={isConfirmRemoveOpen}
          plan={selectedPlan}
          onClose={onConfirmRemoveClose}
          onConfirm={handleCofirmRemove}
        />
      )}
      {isRenameOpen && (
        <RenamePlanModal
          isOpen={isRenameOpen}
          plan={selectedPlan}
          onClose={onRenameClose}
          onConfirm={handleRenameConfirm}
        />
      )}
      <Drawer isOpen={isOpen} placement="bottom" onClose={onClose}>
        <DrawerOverlay />
        <DrawerContent>
          <DrawerCloseButton />
          <DrawerHeader fontWeight="black">Team Plans</DrawerHeader>
          <DrawerBody>
            <VStack alignItems="flex-start" spacing={4}>
              <RadioGroup
                width="100%"
                value={`${teamPlans[selectedIndex].id}`}
                onChange={(value) =>
                  onSelectedIndexChange(
                    teamPlans.findIndex((t) => `${t.id}` === value) || 0
                  )
                }
              >
                <ReactSortable
                  // NOTE: react-sortablejs typescript is not well-defined so just ignore it
                  // @ts-ignore
                  tag={ForwardableVStack}
                  list={teamPlans ?? []}
                  setList={onRearrange}
                  handle=".handle"
                >
                  {teamPlans?.map((plan) => (
                    <HStack key={plan.id} spacing={0} width="100%">
                      <Flex className="handle" cursor="grab" p={2}>
                        <Icon
                          size="sm"
                          as={IoReorderFourOutline}
                          opacity={0.5}
                        />
                      </Flex>
                      <Box flexGrow={1} position="relative">
                        <Radio value={plan.id}>
                          <Text noOfLines={1}>{plan.id}</Text>
                        </Radio>
                      </Box>
                      <Menu isLazy>
                        {({ isOpen }) => (
                          <>
                            <MenuButton
                              as={IconButton}
                              size="xs"
                              variant="ghost"
                              aria-label="menu"
                              icon={<Icon as={IoEllipsisVerticalOutline} />}
                            />
                            {isOpen && (
                              <Portal>
                                <MenuList zIndex="popover">
                                  <MenuItem
                                    onClick={() =>
                                      handleRenameClick(`${plan.id}`)
                                    }
                                  >
                                    Rename
                                  </MenuItem>
                                  <MenuItem
                                    onClick={() => onDuplicate(`${plan.id}`)}
                                  >
                                    Duplicate
                                  </MenuItem>
                                  <MenuDivider />
                                  <MenuItem
                                    layerStyle="danger"
                                    onClick={() =>
                                      handleRemoveClick(`${plan.id}`)
                                    }
                                  >
                                    Remove
                                  </MenuItem>
                                </MenuList>
                              </Portal>
                            )}
                          </>
                        )}
                      </Menu>
                    </HStack>
                  ))}
                </ReactSortable>
              </RadioGroup>
              <Divider />
              <Button
                width="100%"
                variant="ghost"
                leftIcon={<Icon as={IoAddOutline} />}
                onClick={onAdd}
              >
                Add new a plan
              </Button>
            </VStack>
          </DrawerBody>
        </DrawerContent>
      </Drawer>
    </>
  );
};

export default TeamPlansDrawer;
