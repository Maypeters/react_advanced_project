import React, { useState } from "react";
import { useLoaderData } from "react-router-dom";
import { SimpleGrid, Heading, Container, Text, Button } from "@chakra-ui/react";
import EventCard from "../components/EventCard";
import EventModal from "../components/EventModal";
import SearchBar from "../components/SearchBar";
import EventFilter from "../components/EventFilter";

export const loader = async () => {
  try {
    // Fetch events from the server
    const eventsResponse = await fetch("http://localhost:3000/events");
    if (!eventsResponse.ok) throw new Error("Error fetching events");
    const eventsData = await eventsResponse.json();
    console.log("Events Data:", eventsData); // This logs the events in the console

    // Fetch categories from the server
    const categoriesResponse = await fetch("http://localhost:3000/categories");
    if (!categoriesResponse.ok) throw new Error("Error fetching categories");
    const categoriesData = await categoriesResponse.json();

    // Fetch users from the server
    const usersResponse = await fetch("http://localhost:3000/users");
    if (!usersResponse.ok) throw new Error("Error fetching users");
    const usersData = await usersResponse.json();

    // Return events, categories, and users data
    return { events: eventsData, categories: categoriesData, users: usersData };
  } catch (error) {
    console.error("Error loading data:", error);
    throw new Response("There was an issue fetching the data.", {
      status: 500,
    });
  }
};

// Function to get categories for an event based on categoryIds
const getCategoriesForEvent = (categoryIds, categories) => {
  const ids = Array.isArray(categoryIds) ? categoryIds : [categoryIds];

  if (ids.length === 0) {
    return ["Unknown"];
  }

  return ids.map((id) => {
    const category = categories.find((cat) => cat.id === id);
    return category ? category.name : "Unknown";
  });
};

export const EventsPage = () => {
  // Get data from loader
  const { events: initialEvents, categories, users } = useLoaderData();
  const [events, setEvents] = useState(initialEvents);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState(""); // State to store search term
  const [selectedCategory, setSelectedCategory] = useState(""); // State to store selected category

  // Open and close modal handlers
  const handleModalOpen = () => setIsModalOpen(true);
  const handleModalClose = () => setIsModalOpen(false);

  // Function to add new event
  const handleAddEvent = async (newEvent) => {
    try {
      const response = await fetch("http://localhost:3000/events", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(newEvent),
      });

      if (!response.ok) throw new Error("Error adding event");

      const addedEvent = await response.json();
      console.log("Added Event:", addedEvent);

      // Add the new event to the state
      setEvents((prevEvents) => [...prevEvents, addedEvent]);
      setIsModalOpen(false);
    } catch (error) {
      console.error("Error adding event:", error);
    }
  };

  // Filter events based on the search term
  const filteredBySearch = events.filter((event) =>
    event.title.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Filter events based on the selected category
  const filteredEvents = filteredBySearch.filter((event) => {
    // If no category is selected, include all events
    if (!selectedCategory) return true;

    // Ensure event.categoryIds is an array
    if (!event.categoryIds || !Array.isArray(event.categoryIds)) {
      return true;
    }

    // Check if the selected category exists in event.categoryIds
    return event.categoryIds.some(
      (categoryId) => String(categoryId) === String(selectedCategory)
    );
  });

  return (
    <Container maxW="container.xl" py={10}>
      <Heading as="h1" size="xl" mb={8} textAlign="center">
        Events
      </Heading>

      {/* Add SearchBar and EventFilter components */}
      <SearchBar searchTerm={searchTerm} onSearchChange={setSearchTerm} />
      <EventFilter
        categories={categories}
        selectedCategory={selectedCategory}
        onCategoryChange={setSelectedCategory}
      />

      <Button colorScheme="blue" mb={4} onClick={handleModalOpen}>
        Add event
      </Button>

      {/* Display a message if no events match the search or filter criteria */}
      {filteredEvents.length === 0 ? (
        <Text textAlign="center" fontSize="xl" color="gray.500">
          No events found for {searchTerm} in the {selectedCategory} category.
        </Text>
      ) : (
        <SimpleGrid columns={[1, 2, 3]} spacing={8}>
          {filteredEvents.map((event) => (
            <EventCard
              key={event.id}
              id={event.id} // VERY IMPORTANT: Make sure you are passing the 'id' here
              title={event.title}
              description={event.description}
              image={event.image}
              startTime={event.startTime}
              endTime={event.endTime}
              categories={getCategoriesForEvent(event.categoryIds, categories)}
            />
          ))}
        </SimpleGrid>
      )}

      {/* Event modal for adding new event */}
      <EventModal
        isOpen={isModalOpen}
        onClose={handleModalClose}
        categories={categories}
        onSubmit={handleAddEvent} // Change this to 'onSubmit' instead of 'onEventAdded'
        users={users}
      />
    </Container>
  );
};
