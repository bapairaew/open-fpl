import {
  AlertDialog,
  AlertDialogBody,
  AlertDialogContent,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogOverlay,
  Box,
  Button,
  Flex,
  Icon,
  IconButton,
  Input,
  Menu,
  MenuButton,
  MenuDivider,
  MenuItem,
  MenuList,
  Portal,
  TabProps,
  useDisclosure,
  useStyles,
  useTab,
} from "@chakra-ui/react";
import {
  ChangeEvent,
  MouseEvent,
  MouseEventHandler,
  useEffect,
  useRef,
  useState,
} from "react";
import {
  IoDuplicateOutline,
  IoEllipsisVerticalOutline,
  IoPencilOutline,
  IoTrashBinOutline,
} from "react-icons/io5";

const TransferPlannerTab = ({
  plan,
  onNameChange,
  onRemoveClick,
  onDuplicateClick,
  ...props
}: TabProps & {
  plan: string;
  onNameChange: (name: string) => void;
  onRemoveClick: MouseEventHandler<HTMLButtonElement>;
  onDuplicateClick: MouseEventHandler<HTMLButtonElement>;
}) => {
  const { role, tabIndex, id, ...tabProps } = useTab(props);
  const styles = useStyles();

  const cancelRemoveRef = useRef<HTMLButtonElement>(null);
  const { isOpen, onOpen, onClose } = useDisclosure();

  const [isRenaming, setIsRenaming] = useState(false);
  const [name, setName] = useState(plan);
  const nameRef = useRef<HTMLInputElement>(null);

  const handleConfirmRemove = (e: MouseEvent<HTMLButtonElement>) => {
    onClose();
    onRemoveClick(e);
  };

  const handleRenameClick = () => {
    setIsRenaming(true);
    setTimeout(() => {
      nameRef.current?.focus();
      nameRef.current?.select();
    }, 300);
  };

  const handleNameChange = (e: ChangeEvent<HTMLInputElement>) =>
    setName(e.target.value);

  const handleRenameDone = () => {
    onNameChange(name);
    setIsRenaming(false);
  };

  useEffect(() => setName(plan), [plan]);

  return (
    <>
      {isOpen && (
        <AlertDialog
          isOpen={isOpen}
          leastDestructiveRef={cancelRemoveRef}
          onClose={onClose}
        >
          <AlertDialogOverlay>
            <AlertDialogContent>
              <AlertDialogHeader fontSize="lg" fontWeight="bold">
                Remove Transfer Plan
              </AlertDialogHeader>
              <AlertDialogBody>
                You are removing "{plan}" transfer plan. Are you sure? You can't
                undo this action afterwards.
              </AlertDialogBody>
              <AlertDialogFooter>
                <Button
                  variant="outline"
                  ref={cancelRemoveRef}
                  onClick={onClose}
                >
                  Cancel
                </Button>
                <Button colorScheme="red" onClick={handleConfirmRemove} ml={3}>
                  Remove
                </Button>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialogOverlay>
        </AlertDialog>
      )}
      <Flex position="relative" role={role} tabIndex={tabIndex} id={id}>
        <Box as="button" sx={styles.tab} {...tabProps}>
          <Box as="span" pr="30px">
            {name}
          </Box>
        </Box>
        {isRenaming && (
          <Box
            as="form"
            position="absolute"
            m="1px"
            py={2}
            px={4}
            bg="white"
            outline={1}
            onSubmit={handleRenameDone}
          >
            <Input
              variant="unstyled"
              ref={nameRef}
              value={name}
              onBlur={handleRenameDone}
              onChange={handleNameChange}
            />
          </Box>
        )}
        <Menu isLazy>
          {({ isOpen }) => (
            <>
              <MenuButton
                as={IconButton}
                position="absolute"
                top={2}
                right={1}
                size="xs"
                zIndex="docked"
                variant="ghost"
                aria-label="menu"
                icon={<Icon as={IoEllipsisVerticalOutline} />}
              />
              {isOpen && (
                <Portal>
                  <MenuList zIndex="popover">
                    <MenuItem
                      onClick={handleRenameClick}
                      icon={<Icon as={IoPencilOutline} />}
                    >
                      Rename
                    </MenuItem>
                    <MenuItem
                      onClick={onDuplicateClick}
                      icon={<Icon as={IoDuplicateOutline} />}
                    >
                      Duplicate
                    </MenuItem>
                    <MenuDivider />
                    <MenuItem
                      color="red.600"
                      onClick={onOpen}
                      icon={<Icon as={IoTrashBinOutline} />}
                    >
                      Remove
                    </MenuItem>
                  </MenuList>
                </Portal>
              )}
            </>
          )}
        </Menu>
      </Flex>
    </>
  );
};

export default TransferPlannerTab;
