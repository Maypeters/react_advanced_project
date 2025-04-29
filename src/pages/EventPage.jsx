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
} from "@chakra-ui/react";
import { useLoaderData } from "react-router-dom";
import EventForm from "../components/EventForm";

export const loader = async ({ params }) => {
  const { eventId } = params;

  // Haal event op
  const eventResponse = await fetch(`http://localhost:3000/events/${eventId}`);
  if (!eventResponse.ok) {
    throw new Response("Event not found", { status: 404 });
  }
  const event = await eventResponse.json();

  // Haal categorieën op
  const categoriesResponse = await fetch("http://localhost:3000/categories");
  if (!categoriesResponse.ok) {
    throw new Response("Categories not found", { status: 404 });
  }
  const categories = await categoriesResponse.json();

  // Haal de relevante categorieën op voor dit specifieke event
  const eventCategories = event.categoryIds.map((categoryId) =>
    categories.find((category) => category.id === categoryId)
  );

  // Haal de gebruiker op die het event heeft aangemaakt
  const userResponse = await fetch(
    `http://localhost:3000/users/${event.createdBy}`
  );
  if (!userResponse.ok) {
    throw new Response("User not found", { status: 404 });
  }
  const user = await userResponse.json();

  return { event, eventCategories, user, categories }; // Geef zowel event, eventCategories als user terug
};

export const EventPage = () => {
  const { event, eventCategories, user, categories } = useLoaderData();

  const { isOpen, onOpen, onClose } = useDisclosure();
  const [currentEvent, setCurrentEvent] = useState(event);

  const startTime = new Date(currentEvent.startTime).toLocaleString();
  const endTime = new Date(currentEvent.endTime).toLocaleString();
  const eventUser = user ? user.name : "Unknown";

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

      const updatedEvent = await response.json();
      setCurrentEvent(updatedEvent); // Update de event in de state
      onClose(); // Sluit de modal
    } catch (error) {
      console.error(error);
      alert("There was a problem updating the event.");
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

        <Text
          fontSize="lg"
          mb={6}
          maxW="800px"
          textAlign="center"
          color="gray.700"
        >
          {currentEvent.description}
        </Text>

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

        {/* EDIT BUTTON */}
        <Button onClick={onOpen} colorScheme="teal" mt={8} width="full">
          Edit Event
        </Button>

        {/* EDIT MODAL */}
        <Modal isOpen={isOpen} onClose={onClose}>
          <ModalOverlay />
          <ModalContent>
            <ModalHeader>Edit Event</ModalHeader>
            <ModalCloseButton />
            <ModalBody pb={6}>
              <EventForm
                onSubmit={handleUpdate}
                categories={categories}
                initialData={currentEvent} // <-- Geef de huidige event data mee
              />
            </ModalBody>
          </ModalContent>
        </Modal>
      </Box>
    </Box>
  );
};
