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
  UseRadioProps,
} from "@chakra-ui/react";
import { useMemo, useRef } from "react";
import {
  IoRadioButtonOffOutline,
  IoRadioButtonOnOutline,
  IoTrashBinOutline,
} from "react-icons/io5";
import { nFormatter } from "~/features/Common/utils";
import { Preference } from "~/features/Settings/settingsTypes";
import {
  getPreferenceKey,
  getTransferPlanKey,
} from "~/features/Settings/storageKeys";
import useLocalStorage from "~/features/Common/useLocalStorage";
import {
  Change,
  ChangePlayer,
} from "~/features/TransferPlanner/transferPlannerTypes";

const SettingsProfile = ({
  teamId,
  onRemove,
  radioProps,
}: {
  radioProps: UseRadioProps;
  teamId: string;
  onRemove: (id: string) => void;
}) => {
  const { getInputProps, getCheckboxProps } = useRadio(radioProps);
  const { isChecked } = radioProps;
  const { onOpen, onClose, isOpen } = useDisclosure();
  const firstFieldRef = useRef(null);

  const [preference] = useLocalStorage<Preference>(
    getPreferenceKey(teamId),
    {}
  );

  const input = getInputProps();
  const checkbox = getCheckboxProps();

  const [transferPlan] = useLocalStorage<Change<ChangePlayer>[]>(
    getTransferPlanKey(teamId),
    null
  );
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
            {preference?.name ?? `Team ${teamId}`}
          </Heading>
          <Text color="gray.600" fontSize="xs">
            Team ID: {teamId}
          </Text>
          <Text color="gray.600" fontSize="xs">
            Transfer plan size: {nFormatter(transferPlanSize, 1)}b
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
                <Button size="sm" onClick={() => onRemove(teamId)}>
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
