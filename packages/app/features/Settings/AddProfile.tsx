import {
  Box,
  Button,
  CloseButton,
  Collapse,
  FormControl,
  FormLabel,
  Icon,
  IconButton,
  Input,
  InputGroup,
  InputRightElement,
  Link as A,
  Popover,
  PopoverArrow,
  PopoverBody,
  PopoverCloseButton,
  PopoverContent,
  PopoverHeader,
  PopoverTrigger,
  Portal,
  useToast,
  VStack,
} from "@chakra-ui/react";
import { useSettings } from "@open-fpl/app/features/Settings/Settings";
import Link from "next/link";
import { FormEvent, MutableRefObject, useEffect, useState } from "react";
import { IoHelpCircleOutline } from "react-icons/io5";

const TeamIDHelpButton = () => {
  const { onSettingsModalClose } = useSettings();
  return (
    <Popover strategy="fixed">
      {({ isOpen }) => {
        return (
          <>
            <PopoverTrigger>
              <IconButton
                aria-label="help"
                variant="ghost"
                borderTopLeftRadius="none"
                borderBottomLeftRadius="none"
                icon={<Icon aria-label="help" as={IoHelpCircleOutline} />}
              />
            </PopoverTrigger>
            {isOpen && (
              <Portal>
                <Box zIndex="popover" position="fixed">
                  <PopoverContent>
                    <PopoverArrow />
                    <PopoverCloseButton />
                    <PopoverHeader fontWeight="black">
                      Find your team ID
                    </PopoverHeader>
                    <PopoverBody>
                      Don't know where to find it? Just follow this{" "}
                      <Link href="/help/id" passHref>
                        <A onClick={onSettingsModalClose}>
                          find your team ID guide
                        </A>
                      </Link>
                      !
                    </PopoverBody>
                  </PopoverContent>
                </Box>
              </Portal>
            )}
          </>
        );
      }}
    </Popover>
  );
};

const AddProfile = ({
  initialFocusRef,
  hasExistedProfile,
  onAddProfile,
}: {
  initialFocusRef: MutableRefObject<
    HTMLInputElement | HTMLButtonElement | null
  >;
  hasExistedProfile: boolean;
  onAddProfile?: (profile: string) => void;
}) => {
  const [formTeamId, setFormTeamId] = useState("");
  const [expanded, setExpanded] = useState(!hasExistedProfile);
  const [isAdding, setIsAdding] = useState(false);
  const toast = useToast();

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    try {
      e.preventDefault();
      setIsAdding(true);
      await onAddProfile?.(formTeamId);
      setExpanded(false);
    } catch (e) {
      toast({
        title: "Something went wrong.",
        description: e.toString(),
        status: "error",
        isClosable: true,
      });
    } finally {
      setIsAdding(false);
    }
  };

  useEffect(() => {
    if (!expanded) {
      setFormTeamId("");
    }
  }, [expanded]);

  useEffect(() => {
    if (!hasExistedProfile) {
      setExpanded(true);
    }
  }, [hasExistedProfile]);

  useEffect(() => {
    // Once the last profile is removed the input box should be auto focused
    if (
      !hasExistedProfile &&
      expanded &&
      initialFocusRef.current instanceof HTMLInputElement
    ) {
      initialFocusRef.current.focus();
    }
  }, [hasExistedProfile, expanded]);

  return (
    <>
      <Collapse in={!expanded} animateOpacity>
        <Button
          ref={
            expanded
              ? undefined
              : (initialFocusRef as MutableRefObject<HTMLButtonElement>)
          }
          width="100%"
          variant={hasExistedProfile ? "outline" : "solid"}
          onClick={() => setExpanded(true)}
        >
          Add a new profile
        </Button>
      </Collapse>
      <Collapse in={expanded} animateOpacity>
        <form id="add-profile-form" onSubmit={handleSubmit}>
          <VStack p={4} borderRadius="md" borderWidth={1} position="relative">
            {hasExistedProfile && (
              <CloseButton
                position="absolute"
                top={1}
                right={1}
                onClick={() => setExpanded(false)}
              />
            )}
            <FormControl id="profile">
              <FormLabel>Team ID</FormLabel>
              <InputGroup>
                <Input
                  required
                  type="number"
                  ref={
                    expanded
                      ? (initialFocusRef as MutableRefObject<HTMLInputElement>)
                      : undefined
                  }
                  placeholder="e.g. 254181"
                  value={formTeamId}
                  onChange={(e) => setFormTeamId(e.target.value)}
                />
                <InputRightElement children={<TeamIDHelpButton />} />
              </InputGroup>
            </FormControl>
            <Button
              isLoading={isAdding}
              loadingText="Adding your profile"
              mt={2}
              width="100%"
              type="submit"
            >
              Add
            </Button>
          </VStack>
        </form>
      </Collapse>
    </>
  );
};

export default AddProfile;
