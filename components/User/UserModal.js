import {
  Button,
  Drawer,
  DrawerBody,
  DrawerCloseButton,
  DrawerContent,
  DrawerFooter,
  DrawerHeader,
  DrawerOverlay,
  Input,
  FormLabel,
} from "@chakra-ui/react";
import { useEffect, useRef, useState } from "react";
import { useUser } from "~/components/User/UserContext";
import { useToast } from "@chakra-ui/react";

const UserModal = ({ isOpen, onClose }) => {
  const toast = useToast();
  const initialFocusRef = useRef();
  const { teamId, setTeamId } = useUser();
  const [formTeamId, setFormTeamId] = useState(teamId);

  useEffect(() => {
    if (isOpen) {
      setFormTeamId(teamId || "");
    }
  }, [isOpen]);

  const onSubmit = (e) => {
    e.preventDefault();
    setTeamId(formTeamId);
    onClose();
    if (formTeamId) {
      toast({
        position: "bottom-right",
        title: "Team ID saved.",
        description: "All features have been unlocked!",
        status: "success",
        duration: 9000,
        isClosable: true,
      });
    } else {
      toast({
        position: "bottom-right",
        title: "Team ID removed.",
        description: "Set up your team ID again to get all features unlocked!",
        status: "success",
        duration: 9000,
        isClosable: true,
      });
    }
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
            <Input
              ref={initialFocusRef}
              id="teamId"
              placeholder="e.g. 254181"
              value={formTeamId}
              onChange={(e) => setFormTeamId(e.target.value)}
            />
          </form>
          {/* TODO: Storage manager */}
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
