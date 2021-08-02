import {
  Box,
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
  Text,
  useColorMode,
  useDisclosure,
  useStyles,
  useTab,
} from "@chakra-ui/react";
import RemovePlanCofirmDialog from "@open-fpl/app/features/TeamPlanner/RemovePlanCofirmModal";
import {
  ChangeEvent,
  KeyboardEvent,
  MouseEvent,
  MouseEventHandler,
  useEffect,
  useRef,
  useState,
} from "react";
import { IoEllipsisVerticalOutline } from "react-icons/io5";

const TeamPlannerTab = ({
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

  const { colorMode } = useColorMode();
  const { isOpen, onOpen, onClose } = useDisclosure();

  const [isRenaming, setIsRenaming] = useState(false);
  const [name, setName] = useState(plan);
  const nameRef = useRef<HTMLInputElement>(null);

  const handleRenameClick = () => {
    setIsRenaming(true);
    setTimeout(() => {
      nameRef.current?.focus();
      nameRef.current?.select();
    }, 300);
  };

  const handleNameChange = (e: ChangeEvent<HTMLInputElement>) =>
    setName(e.target.value);

  const handleRenameKeyPress = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "ArrowRight" || e.key === "ArrowLeft") {
      // Prevent arrow key moving selected tab
      e.stopPropagation();
    }
  };

  const handleRenameDone = () => {
    onNameChange(name);
    setIsRenaming(false);
  };

  useEffect(() => setName(plan), [plan]);

  const handleConfirmRemove = (e: MouseEvent<HTMLButtonElement>) => {
    onClose();
    onRemoveClick(e);
  };

  return (
    <>
      {isOpen && (
        <RemovePlanCofirmDialog
          isOpen={isOpen}
          plan={plan}
          onClose={onClose}
          onConfirm={handleConfirmRemove}
        />
      )}
      <Flex position="relative" role={role} tabIndex={tabIndex} id={id}>
        <Box
          as="button"
          sx={{
            ...styles.tab,
            borderRightWidth: 0,
            borderTopWidth: 2,
            _notLast: { marginEnd: 0 },
          }}
          {...tabProps}
        >
          <Text
            as="span"
            pr="30px"
            width="100px"
            noOfLines={1}
            textAlign="left"
          >
            {name}
          </Text>
        </Box>
        {isRenaming && (
          <Box
            as="form"
            position="absolute"
            m="1px"
            py={2}
            px={4}
            bgColor={colorMode === "dark" ? "gray.800" : "white"}
            outline={1}
            onSubmit={handleRenameDone}
          >
            <Input
              variant="unstyled"
              borderWidth={1}
              borderRadius="none"
              p="2px"
              m="-2px"
              ref={nameRef}
              value={name}
              onBlur={handleRenameDone}
              onChange={handleNameChange}
              onKeyDown={handleRenameKeyPress}
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
                    <MenuItem onClick={handleRenameClick}>Rename</MenuItem>
                    <MenuItem onClick={onDuplicateClick}>Duplicate</MenuItem>
                    <MenuDivider />
                    <MenuItem color="red.600" onClick={onOpen}>
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

export default TeamPlannerTab;
