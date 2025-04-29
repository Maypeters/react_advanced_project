import { useState } from "react";
import {
  Box,
  Heading,
  Text,
  HStack,
  Tag,
  Image,
  Button,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalCloseButton,
  ModalBody,
  useDisclosure,
  useToast,
} from "@chakra-ui/react";
import { useLoaderData, useNavigate } from "react-router-dom";
import EventForm from "../components/EventForm";
import DeleteConfirmationModal from "../components/DeleteConfirmationModal";

// Loader function to fetch data for a specific event
export const loader = async ({ params }) => {
  const { eventId } = params;

  // Fetch event data
  const eventResponse = await fetch(`http://localhost:3000/events/${eventId}`);
  if (!eventResponse.ok) {
    throw new Response("Event not found", { status: 404 });
  }
  const event = await eventResponse.json();

  // Fetch categories data
  const categoriesResponse = await fetch("http://localhost:3000/categories");
  if (!categoriesResponse.ok) {
    throw new Response("Categories not found", { status: 404 });
  }
  const categories = await categoriesResponse.json();

  // Get the relevant categories for the event
  const eventCategories = event.categoryIds.map((categoryId) =>
    categories.find((category) => category.id === categoryId)
  );

  // Fetch the user who created the event
  const userResponse = await fetch(
    `http://localhost:3000/users/${event.createdBy}`
  );
  if (!userResponse.ok) {
    throw new Response("User not found", { status: 404 });
  }
  const user = await userResponse.json();

  return { event, eventCategories, user, categories }; // Return event, eventCategories, and user
};

// Event page component
export const EventPage = () => {
  const [isDeleteOpen, setIsDeleteOpen] = useState(false); // State to control the delete modal visibility
  const openDeleteModal = () => setIsDeleteOpen(true); // Open the delete modal
  const closeDeleteModal = () => setIsDeleteOpen(false); // Close the delete modal
  const { event, eventCategories, user, categories } = useLoaderData(); // Data from loader function

  const { isOpen, onOpen, onClose } = useDisclosure(); // Chakra UI modal control hooks
  const [currentEvent, setCurrentEvent] = useState(event); // State to store the current event data

  const startTime = new Date(currentEvent.startTime).toLocaleString(); // Format event start time
  const endTime = new Date(currentEvent.endTime).toLocaleString(); // Format event end time
  const eventUser = user ? user.name : "Unknown"; // Get event creator's name (or 'Unknown' if not available)
  const toast = useToast(); // Toast notifications
  const navigate = useNavigate(); // React Router navigate function

  // Handle event update
  const handleUpdate = async (updatedData) => {
    try {
      const response = await fetch(
        `http://localhost:3000/events/${currentEvent.id}`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(updatedData),
        }
      );

      if (!response.ok) {
        throw new Error("Failed to update event");
      }

      const updatedEvent = await response.json(); // Get updated event data
      setCurrentEvent(updatedEvent); // Update the current event state
      onClose(); // Close the edit modal

      toast({
        title: "Event updated.",
        description: "The event has been successfully updated.",
        status: "success",
        duration: 5000,
        isClosable: true,
        position: "top-right",
      });
    } catch (error) {
      console.error(error);
      toast({
        title: "Update failed.",
        description: "There was a problem updating the event.",
        status: "error",
        duration: 5000,
        isClosable: true,
        position: "top-right",
      });
    }
  };

  // Handle event deletion
  const handleDelete = async () => {
    try {
      const response = await fetch(
        `http://localhost:3000/events/${currentEvent.id}`,
        {
          method: "DELETE",
        }
      );

      if (!response.ok) {
        throw new Error("Failed to delete event");
      }

      toast({
        title: "Event deleted.",
        description: "The event has been successfully deleted.",
        status: "success",
        duration: 5000,
        isClosable: true,
      });

      // Redirect back to the event list or homepage
      navigate("/");
    } catch (error) {
      toast({
        title: "Error",
        description: "There was a problem deleting the event.",
        status: "error",
        duration: 5000,
        isClosable: true,
      });
      console.error(error);
    } finally {
      closeDeleteModal(); // Close the delete modal after action
    }
  };

  return (
    <Box
      p={6}
      bg="gray.50"
      minH="100vh"
      display="flex"
      justifyContent="center"
      alignItems="center"
    >
      <Box
        bg="white"
        p={8}
        borderRadius="lg"
        boxShadow="lg"
        maxW="900px"
        w="full"
      >
        {/* Event image */}
        <Image
          src={currentEvent.image}
          alt={currentEvent.title}
          borderRadius="lg"
          boxShadow="md"
          objectFit="cover"
          mb={6}
          w="full"
          h="300px"
        />

        {/* Event title */}
        <Heading
          as="h1"
          size="2xl"
          mb={4}
          color="teal.600"
          fontWeight="bold"
          textAlign="center"
        >
          {currentEvent.title}
        </Heading>

        {/* Event description */}
        <Text
          fontSize="lg"
          mb={6}
          maxW="800px"
          textAlign="center"
          color="gray.700"
        >
          {currentEvent.description}
        </Text>

        {/* Event start and end times */}
        <Text
          fontSize="lg"
          mb={6}
          maxW="800px"
          textAlign="center"
          color="gray.600"
        >
          <strong>Start time:</strong> {startTime} <br />
          <strong>End time:</strong> {endTime}
        </Text>

        {/* Location */}
        <Text
          fontSize="lg"
          mb={6}
          maxW="800px"
          textAlign="center"
          color="gray.600"
        >
          <strong>Location:</strong> {currentEvent.location} <br />
        </Text>

        {/* Categories */}
        <Heading
          size="lg"
          mb={4}
          color="teal.500"
          fontWeight="semibold"
          textAlign="center"
        >
          Categories:
        </Heading>
        <HStack spacing={6} mb={8} justify="center">
          {eventCategories.map((category) => (
            <Tag
              key={category.id}
              colorScheme="teal"
              fontWeight="bold"
              borderRadius="full"
              px={4}
              py={2}
              fontSize="md"
            >
              {category.name.toUpperCase()}
            </Tag>
          ))}
        </HStack>

        {/* User info */}
        <Box
          textAlign="center"
          mt={12}
          p={4}
          bg="gray.50"
          borderRadius="lg"
          boxShadow="md"
        >
          <Image
            src={user ? user.image : "default-image.jpg"}
            alt={eventUser}
            borderRadius="full"
            boxSize="80px"
            mx="auto"
            mb={4}
          />
          <Text color="gray.600" fontSize="sm">
            Created by: {eventUser}
          </Text>
        </Box>

        {/* Edit button */}
        <Button onClick={onOpen} colorScheme="teal" mt={8} width="full">
          Edit Event
        </Button>

        {/* Edit modal */}
        <Modal isOpen={isOpen} onClose={onClose}>
          <ModalOverlay />
          <ModalContent>
            <ModalHeader>Edit Event</ModalHeader>
            <ModalCloseButton />
            <ModalBody pb={6}>
              <EventForm
                onSubmit={handleUpdate}
                categories={categories}
                initialData={currentEvent} // Pass current event data to form
              />
            </ModalBody>
          </ModalContent>
        </Modal>

        {/* Delete button */}
        <Button colorScheme="red" mt={4} width="full" onClick={openDeleteModal}>
          Delete Event
        </Button>

        {/* Delete confirmation modal */}
        <DeleteConfirmationModal
          isOpen={isDeleteOpen}
          onClose={closeDeleteModal}
          onConfirm={handleDelete}
        />
      </Box>
    </Box>
  );
};
