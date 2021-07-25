import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  Button,
  FormControl,
  FormLabel,
  Input,
} from "@chakra-ui/react";
import { MouseEventHandler, useRef, useState } from "react";

const RenamePlanModal = ({
  plan,
  isOpen,
  onClose,
  onConfirm,
}: {
  plan: string;
  isOpen: boolean;
  onClose: () => void;
  onConfirm: (name: string) => void;
}) => {
  const initialRef = useRef<HTMLInputElement>(null);
  const [name, setName] = useState(plan);
  const handleConfirm = () => onConfirm(name);

  return (
    <Modal isOpen={isOpen} onClose={onClose} initialFocusRef={initialRef}>
      <ModalOverlay />
      <ModalContent>
        <ModalHeader fontSize="lg" fontWeight="bold">
          Rename Team Plan
        </ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          <form id="rename-team-plan-form" onSubmit={handleConfirm}>
            <FormControl id="plan-name">
              <FormLabel>Plan name</FormLabel>
              <Input
                ref={initialRef}
                placeholder="Plan name"
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
            </FormControl>
          </form>
        </ModalBody>
        <ModalFooter>
          <Button variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button type="submit" form="rename-team-plan-form" ml={3}>
            Confirm
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};

export default RenamePlanModal;
