import {
  Box,
  Button,
  Divider,
  Heading,
  HStack,
  Icon,
  IconButton,
  Menu,
  MenuButton,
  MenuDivider,
  MenuItem,
  MenuItemOption,
  MenuList,
  MenuOptionGroup,
  Portal,
  Radio,
  RadioGroup,
} from "@chakra-ui/react";
import { AppDrawerOpenButton } from "@open-fpl/app/features/Layout/AppDrawer";
import { MouseEvent } from "react";
import { IoSettingsOutline } from "react-icons/io5";

const FixturesToolbar = ({
  mode,
  onModeChange,
  onEditTeamsStrengthClick,
}: {
  mode: string;
  onModeChange: (mode: string) => void;
  onEditTeamsStrengthClick?: (e: MouseEvent<HTMLButtonElement>) => void;
}) => {
  return (
    <HStack
      alignItems="center"
      height="50px"
      width="100%"
      px={1}
      spacing={1}
      borderBottomWidth={1}
    >
      <HStack spacing={1} height="50px" display={{ base: "flex", sm: "none" }}>
        <AppDrawerOpenButton />
        <Divider orientation="vertical" />
      </HStack>
      <HStack
        spacing={1}
        height="50px"
        flexGrow={{ base: 1, sm: 0 }}
        flexBasis={{ base: "100%", sm: "auto" }}
      >
        <Heading px={2} fontWeight="black" fontSize="lg" flexGrow={1}>
          Fixture Difficulty Rating
        </Heading>
        <Divider orientation="vertical" />
      </HStack>
      <HStack
        spacing={1}
        height="50px"
        flexGrow={1}
        display={{ base: "flex", sm: "none" }}
      >
        <Menu isLazy>
          {({ isOpen }) => (
            <>
              <MenuButton
                as={IconButton}
                borderRadius="none"
                variant="ghost"
                aria-label="menu options"
                icon={<Icon as={IoSettingsOutline} />}
              />
              {isOpen && (
                <Portal>
                  <MenuList zIndex="popover">
                    <MenuOptionGroup
                      title="Mode"
                      type="radio"
                      aria-label="difficulty rating mode"
                      value={mode}
                      onChange={(value) =>
                        typeof value === "string"
                          ? onModeChange(value)
                          : onModeChange(value[0])
                      }
                    >
                      <MenuItemOption value="attack">Attack</MenuItemOption>
                      <MenuItemOption value="defence">Defence</MenuItemOption>
                    </MenuOptionGroup>
                    <MenuDivider />
                    <MenuItem
                      icon={<Icon as={IoSettingsOutline} />}
                      onClick={onEditTeamsStrengthClick}
                    >
                      Edit teams strength
                    </MenuItem>
                  </MenuList>
                </Portal>
              )}
            </>
          )}
        </Menu>
      </HStack>
      <HStack
        spacing={1}
        height="50px"
        flexGrow={1}
        display={{ base: "none", sm: "flex" }}
        alignItems="stretch"
      >
        <RadioGroup
          px={4}
          aria-label="difficulty rating mode"
          display="flex"
          alignItems="center"
          value={mode}
          onChange={onModeChange}
        >
          <HStack spacing={5}>
            <Radio value="attack">Attack</Radio>
            <Radio value="defence">Defence</Radio>
          </HStack>
        </RadioGroup>
        <Divider orientation="vertical" />
        <Box flexGrow={1} />
        <Divider orientation="vertical" />
        <Box p="2px" mr="2px">
          <Button
            size="sm"
            height="100%"
            variant="ghost"
            borderRadius="none"
            leftIcon={<Icon as={IoSettingsOutline} />}
            onClick={onEditTeamsStrengthClick}
          >
            Edit Teams Strength
          </Button>
        </Box>
      </HStack>
    </HStack>
  );
};

export default FixturesToolbar;
