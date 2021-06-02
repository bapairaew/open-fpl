import {
  Box,
  Button,
  Drawer,
  DrawerBody,
  DrawerCloseButton,
  DrawerContent,
  DrawerFooter,
  DrawerHeader,
  DrawerOverlay,
  FormLabel,
  Icon,
  IconButton,
  Input,
  InputGroup,
  InputRightElement,
  Popover,
  PopoverArrow,
  PopoverBody,
  PopoverCloseButton,
  PopoverContent,
  PopoverHeader,
  PopoverTrigger,
  Portal,
  useToast,
  Link,
} from "@chakra-ui/react";
import { useEffect, useRef, useState } from "react";
import { IoHelpCircleOutline, IoOpenOutline } from "react-icons/io5";
import { getTransferPlanKey } from "~/components/User/storage";
import { useUser } from "~/components/User/UserContext";
import UserStorage from "~/components/User/UserStorage";

const TeamIDHelpButton = () => (
  <Popover>
    <PopoverTrigger>
      <IconButton
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

const UserModal = ({ isOpen, onClose }) => {
  const toast = useToast();
  const initialFocusRef = useRef();
  const { teamId, setTeamId } = useUser();
  const [formTeamId, setFormTeamId] = useState(teamId);
  const [plansToRemove, setPlansToRemove] = useState([]);

  useEffect(() => {
    if (isOpen) {
      setFormTeamId(teamId || "");
    }
  }, [isOpen]);

  const onSubmit = (e) => {
    e.preventDefault();
    setTeamId(formTeamId);
    if (plansToRemove) {
      plansToRemove.forEach((plan) => {
        window.localStorage.removeItem(getTransferPlanKey(plan.teamId));
      });
      setPlansToRemove([]);
    }
    onClose();
    if (formTeamId) {
      toast({
        position: "bottom-right",
        title: "Your details have been saved!",
        description: "Please enjoy using Open FPL!",
        status: "success",
        duration: 9000,
        isClosable: true,
      });
    } else {
      toast({
        position: "bottom-right",
        title: "Your details have been saved!",
        description:
          "Please set up your team ID again to get all features unlocked!",
        status: "success",
        duration: 9000,
        isClosable: true,
      });
    }
  };

  const storage = typeof window !== "undefined" ? window.localStorage : null;

  const handleStorageChange = ({ plansToRemove }) => {
    setPlansToRemove(plansToRemove);
  };

  return (
    <Drawer
      isOpen={isOpen}
      placement="right"
      onClose={onClose}
      initialFocusRef={initialFocusRef}
    >
      <DrawerOverlay />
      <DrawerContent>
        <DrawerCloseButton />
        <DrawerHeader borderBottomWidth="1px">Settings</DrawerHeader>

        <DrawerBody>
          <form id="set-up-form" onSubmit={onSubmit}>
            <FormLabel htmlFor="teamId">Team ID</FormLabel>

            <InputGroup>
              <Input
                ref={initialFocusRef}
                id="teamId"
                placeholder="e.g. 254181"
                value={formTeamId}
                onChange={(e) => setFormTeamId(e.target.value)}
              />
              <InputRightElement children={<TeamIDHelpButton />} />
            </InputGroup>
          </form>
          <Box my={4}>
            <FormLabel>Storage</FormLabel>
            <UserStorage
              storage={storage}
              plansToRemove={plansToRemove}
              onStorageChange={handleStorageChange}
            />
          </Box>
        </DrawerBody>

        <DrawerFooter>
          <Button variant="outline" mr={3} onClick={onClose}>
            Cancel
          </Button>
          <Button type="submit" form="set-up-form">
            Save
          </Button>
        </DrawerFooter>
      </DrawerContent>
    </Drawer>
  );
};

export default UserModal;
