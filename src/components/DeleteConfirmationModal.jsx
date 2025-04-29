import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  ModalCloseButton,
  Button,
  Text,
} from "@chakra-ui/react";

// DeleteConfirmationModal component prompts the user for confirmation before deleting an event
const DeleteConfirmationModal = ({ isOpen, onClose, onConfirm }) => {
  return (
    <Modal isOpen={isOpen} onClose={onClose} isCentered>
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>Confirm Deletion</ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          {/* Warning message displayed in red */}
          <Text color="red.600" fontWeight="semibold">
            Are you absolutely sure you want to delete this event? This action
            cannot be undone.
          </Text>
        </ModalBody>
        <ModalFooter>
          {/* Cancel button to close the modal */}
          <Button variant="ghost" onClick={onClose} mr={3}>
            Cancel
          </Button>
          {/* Confirm deletion button */}
          <Button colorScheme="red" onClick={onConfirm}>
            Yes, Delete
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};

export default DeleteConfirmationModal;
