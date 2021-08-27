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
  Heading,
  Icon,
  IconButton,
  Text,
  useRadio,
  UseRadioProps,
} from "@chakra-ui/react";
import numberFormatter from "@open-fpl/app/features/Common/numberFormatter";
import useLocalStorage, {
  getLocalStorageItem,
} from "@open-fpl/app/features/Common/useLocalStorage";
import { Preference } from "@open-fpl/app/features/Settings/settingsTypes";
import {
  getPreferenceKey,
  getTeamPlanKey,
} from "@open-fpl/app/features/Settings/storageKeys";
import { Change } from "@open-fpl/app/features/TeamPlanner/teamPlannerTypes";
import {
  MouseEvent,
  MouseEventHandler,
  useMemo,
  useRef,
  useState,
} from "react";
import {
  IoRadioButtonOffOutline,
  IoRadioButtonOnOutline,
  IoTrashBinOutline,
} from "react-icons/io5";

const SettingsProfile = ({
  profile,
  radioProps,
  onRemoveClick,
}: {
  profile: string;
  radioProps: UseRadioProps;
  onRemoveClick: MouseEventHandler<HTMLButtonElement>;
}) => {
  const { getInputProps, getCheckboxProps } = useRadio(radioProps);
  const { isChecked } = radioProps;
  const [isOpen, setIsOpen] = useState(false);
  const onClose = () => setIsOpen(false);
  const cancelRef = useRef<HTMLButtonElement>(null);

  const input = getInputProps();
  const checkbox = getCheckboxProps();

  const [preference] = useLocalStorage<Preference>(getPreferenceKey(profile));

  const storageSize = useMemo(() => {
    const allTransferPlans = preference?.teamPlans?.map((name) =>
      getLocalStorageItem<Change[]>(getTeamPlanKey(profile, name), [])
    );

    const allData = [preference, allTransferPlans];

    return new TextEncoder().encode(JSON.stringify([allData])).length;
  }, [preference]);

  const displayName = preference?.name ?? `Team ${profile}`;

  const handleConfirmRemove = (e: MouseEvent<HTMLButtonElement>) => {
    onClose();
    onRemoveClick(e);
  };

  const labelId = `profile-${profile}`;

  return (
    <>
      {isOpen && (
        <AlertDialog
          isOpen={isOpen}
          leastDestructiveRef={cancelRef}
          onClose={onClose}
        >
          <AlertDialogOverlay>
            <AlertDialogContent>
              <AlertDialogHeader fontSize="lg" fontWeight="bold">
                Remove Profile
              </AlertDialogHeader>
              <AlertDialogBody>
                You are removing "{displayName}" profile. Are you sure? You
                can't undo this action afterwards.
              </AlertDialogBody>
              <AlertDialogFooter>
                <Button variant="outline" ref={cancelRef} onClick={onClose}>
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
      <Box as="label" width="100%">
        <input aria-labelledby={labelId} {...input} />
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
            <Heading size="sm" mb={3} id={labelId}>
              {displayName}
            </Heading>
            <Text as="span" fontSize="xs" layerStyle="subtitle" my={1}>
              Team ID: {profile}
            </Text>
            <Text as="span" fontSize="xs" layerStyle="subtitle" my={1}>
              Storage size: {numberFormatter(storageSize, 1)}b
            </Text>
          </Box>
          <Flex>
            <IconButton
              colorScheme="red"
              variant="ghost"
              aria-label="remove"
              height="100%"
              width="100%"
              borderTopLeftRadius={0}
              borderBottomLeftRadius={0}
              icon={<Icon as={IoTrashBinOutline} />}
              onClick={() => setIsOpen(true)}
            />
          </Flex>
        </Flex>
      </Box>
    </>
  );
};

export default SettingsProfile;
