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

const EventModal = ({
  isOpen,
  onClose,
  categories,
  onSubmit,
  users,
  initialData,
}) => {
  // Handle form submission
  const handleFormSubmit = (formData) => {
    // Call the onSubmit prop (which could be used for both adding and updating events)
    onSubmit(formData);
    onClose(); // Close the modal after submitting the form
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>
          {/* Conditional text based on whether initial data exists (for editing) */}
          {initialData ? "Edit Event" : "Add New Event"}
        </ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          {/* EventForm receives the handler for form submission and initial data */}
          <EventForm
            onSubmit={handleFormSubmit} // Pass the handler function to EventForm
            categories={categories}
            users={users}
            initialData={initialData}
          />
        </ModalBody>
      </ModalContent>
    </Modal>
  );
};

export default EventModal;
