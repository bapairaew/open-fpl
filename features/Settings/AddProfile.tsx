import {
  Box,
  Button,
  CloseButton,
  Collapse,
  FormLabel,
  Icon,
  IconButton,
  Input,
  InputGroup,
  InputRightElement,
  Link,
  Popover,
  PopoverArrow,
  PopoverBody,
  PopoverCloseButton,
  PopoverContent,
  PopoverHeader,
  PopoverTrigger,
  useToast,
} from "@chakra-ui/react";
import { MutableRefObject, useEffect, useState } from "react";
import { IoHelpCircleOutline, IoOpenOutline } from "react-icons/io5";

const TeamIDHelpButton = () => (
  <Popover>
    <PopoverTrigger>
      <IconButton
        aria-label="help"
        variant="ghost"
        icon={<Icon aria-label="help" as={IoHelpCircleOutline} />}
      />
    </PopoverTrigger>
    <PopoverContent>
      <PopoverArrow />
      <PopoverCloseButton />
      <PopoverHeader>Find your team ID</PopoverHeader>
      <PopoverBody>
        Don't know where to find it? Just follow this{" "}
        <Link color="brand.500" href="https://fpl.team/find-id" isExternal>
          find your team ID guide <Icon as={IoOpenOutline} />
        </Link>
        !
      </PopoverBody>
    </PopoverContent>
  </Popover>
);

const AddProfile = ({
  initialFocusRef,
  hasExistedProfile,
  onAddProfile,
}: {
  initialFocusRef:
    | MutableRefObject<HTMLInputElement>
    | MutableRefObject<HTMLButtonElement>;
  hasExistedProfile: boolean;
  onAddProfile?: (teamId: string) => void;
}) => {
  const [formTeamId, setFormTeamId] = useState("");
  const [expanded, setExpanded] = useState(!hasExistedProfile);
  const [isAdding, setIsAdding] = useState(false);
  const toast = useToast();

  const onSubmit = async (e) => {
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
        <Box
          as="form"
          id="set-up-form"
          onSubmit={onSubmit}
          p={4}
          borderRadius="md"
          borderWidth={1}
          position="relative"
        >
          {hasExistedProfile && (
            <CloseButton
              position="absolute"
              top={1}
              right={1}
              onClick={() => setExpanded(false)}
            />
          )}
          <FormLabel htmlFor="teamId">Team ID</FormLabel>
          <InputGroup>
            <Input
              ref={
                expanded
                  ? (initialFocusRef as MutableRefObject<HTMLInputElement>)
                  : undefined
              }
              id="teamId"
              placeholder="e.g. 254181"
              value={formTeamId}
              onChange={(e) => setFormTeamId(e.target.value)}
            />
            <InputRightElement children={<TeamIDHelpButton />} />
          </InputGroup>
          <Button
            isLoading={isAdding}
            loadingText="Adding your profile"
            mt={2}
            width="100%"
            type="submit"
          >
            Add
          </Button>
        </Box>
      </Collapse>
    </>
  );
};

export default AddProfile;
