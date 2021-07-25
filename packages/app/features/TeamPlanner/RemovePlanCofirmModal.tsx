import {
  AlertDialog,
  AlertDialogBody,
  AlertDialogContent,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogOverlay,
  Button,
} from "@chakra-ui/react";
import { MouseEventHandler, useRef } from "react";

const RemovePlanCofirmModal = ({
  plan,
  isOpen,
  onClose,
  onConfirm,
}: {
  plan: string;
  isOpen: boolean;
  onClose: () => void;
  onConfirm: MouseEventHandler<HTMLButtonElement>;
}) => {
  const cancelRemoveRef = useRef<HTMLButtonElement>(null);

  return (
    <AlertDialog
      isOpen={isOpen}
      leastDestructiveRef={cancelRemoveRef}
      onClose={onClose}
    >
      <AlertDialogOverlay>
        <AlertDialogContent>
          <AlertDialogHeader fontSize="lg" fontWeight="bold">
            Remove Team Plan
          </AlertDialogHeader>
          <AlertDialogBody>
            You are removing "{plan}" team plan. Are you sure? You can't undo
            this action afterwards.
          </AlertDialogBody>
          <AlertDialogFooter>
            <Button variant="outline" ref={cancelRemoveRef} onClick={onClose}>
              Cancel
            </Button>
            <Button colorScheme="red" onClick={onConfirm} ml={3}>
              Remove
            </Button>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialogOverlay>
    </AlertDialog>
  );
};

export default RemovePlanCofirmModal;
