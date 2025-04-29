import React from "react";
import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalCloseButton,
  ModalBody,
} from "@chakra-ui/react";
import EventForm from "./EventForm";

const EventModal = ({ isOpen, onClose, categories, onEventAdded }) => {
  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>Add New Event</ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          <EventForm
            onSubmit={(formData) => {
              onEventAdded(formData); // Doorgeven van de data naar de parent
              onClose(); // Sluit de modal na toevoegen
            }}
            categories={categories}
          />
        </ModalBody>
      </ModalContent>
    </Modal>
  );
};

export default EventModal;
