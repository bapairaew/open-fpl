import {
  Box,
  Button,
  Flex,
  Heading,
  Icon,
  IconButton,
  Popover,
  PopoverArrow,
  PopoverBody,
  PopoverCloseButton,
  PopoverContent,
  PopoverFooter,
  PopoverHeader,
  PopoverTrigger,
  Text,
  useDisclosure,
  useRadio,
} from "@chakra-ui/react";
import { useMemo, useRef } from "react";
import {
  IoRadioButtonOffOutline,
  IoRadioButtonOnOutline,
  IoTrashBinOutline,
} from "react-icons/io5";
import { getTransferPlanKey } from "~/components/Settings/storage";
import { nFormatter } from "~/libs/numbers";
import useLocalStorage from "~/libs/useLocalStorage";

const SettingsProfile = (props) => {
  const { getInputProps, getCheckboxProps } = useRadio(props);
  const { teamId, isChecked, onRemove } = props;
  const { onOpen, onClose, isOpen } = useDisclosure();
  const firstFieldRef = useRef();

  const input = getInputProps();
  const checkbox = getCheckboxProps();

  const [transferPlan] = useLocalStorage(getTransferPlanKey(teamId), null);
  const transferPlanSize = useMemo(
    () =>
      transferPlan
        ? new TextEncoder().encode(JSON.stringify(transferPlan)).length
        : 0,
    [transferPlan]
  );

  return (
    <Box as="label" width="100%">
      <input {...input} />
      <Flex
        {...checkbox}
        cursor="pointer"
        borderWidth={1}
        borderRadius="md"
        _hover={{
          boxShadow: "sm",
        }}
        _focus={{
          boxShadow: "outline",
        }}
        _checked={{
          borderColor: "green",
        }}
      >
        <Flex
          pt={5}
          pl={4}
          flexBasis="24px"
          justifyContent="center"
          alignItems="flex-start"
        >
          <Icon
            color={isChecked ? "green" : undefined}
            as={isChecked ? IoRadioButtonOnOutline : IoRadioButtonOffOutline}
          />
        </Flex>
        <Box px={2} py={4} flexGrow={1}>
          <Heading size="sm" mb={1}>
            Team {teamId}
          </Heading>
          <Text color="gray" fontSize="xs">
            Transfer plan size {nFormatter(transferPlanSize, 1)}b
          </Text>
        </Box>
        <Flex>
          <Popover
            isOpen={isOpen}
            initialFocusRef={firstFieldRef}
            onOpen={onOpen}
          >
            <PopoverTrigger>
              <IconButton
                variant="ghost"
                aria-label="remove"
                height="100%"
                width="100%"
                borderTopLeftRadius={0}
                borderBottomLeftRadius={0}
                icon={<Icon as={IoTrashBinOutline} />}
              />
            </PopoverTrigger>
            <PopoverContent>
              <PopoverArrow />
              <PopoverCloseButton onClick={onClose} />
              <PopoverHeader>Delete profile</PopoverHeader>
              <PopoverBody>
                Are you sure you want to remove this profile, its settings and
                transfer plan?
              </PopoverBody>
              <PopoverFooter display="flex" justifyContent="flex-end">
                <Button
                  ref={firstFieldRef}
                  variant="outline"
                  size="sm"
                  mr={1}
                  onClick={onClose}
                >
                  Cancel
                </Button>
                <Button size="sm" onClick={onRemove}>
                  Remove
                </Button>
              </PopoverFooter>
            </PopoverContent>
          </Popover>
        </Flex>
      </Flex>
    </Box>
  );
};

export default SettingsProfile;
