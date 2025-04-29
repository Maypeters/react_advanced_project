import React, { useState } from "react";
import { useLoaderData } from "react-router-dom";
import {
  SimpleGrid,
  Heading,
  Container,
  Text,
  Button,
  Box,
  Spinner,
} from "@chakra-ui/react";
import EventCard from "../components/EventCard";
import EventModal from "../components/EventModal";
import SearchBar from "../components/SearchBar";
import EventFilter from "../components/EventFilter"; // Import EventFilter

export const loader = async () => {
  try {
    const eventsResponse = await fetch("http://localhost:3000/events");
    if (!eventsResponse.ok) throw new Error("Error fetching events");
    const eventsData = await eventsResponse.json();
    console.log("Events Data:", eventsData); // Dit toont de evenementen in de console

    const categoriesResponse = await fetch("http://localhost:3000/categories");
    if (!categoriesResponse.ok) throw new Error("Error fetching categories");
    const categoriesData = await categoriesResponse.json();

    return { events: eventsData, categories: categoriesData };
  } catch (error) {
    console.error("Error loading data:", error);
    throw new Response("There was an issue fetching the data.", {
      status: 500,
    });
  }
};

// Functie om categorieën voor een event op te halen op basis van categoryIds
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
  const { events: initialEvents, categories } = useLoaderData();
  const [events, setEvents] = useState(initialEvents);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState(""); // New state to store search term
  const [selectedCategory, setSelectedCategory] = useState(""); // New state to store selected category

  const handleModalOpen = () => setIsModalOpen(true);
  const handleModalClose = () => setIsModalOpen(false);

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

      // Voeg het nieuwe event toe aan de state
      setEvents((prevEvents) => [...prevEvents, addedEvent]);
      setIsModalOpen(false);
    } catch (error) {
      console.error("Error adding event:", error);
    }
  };

  // Filter events op basis van de zoekterm
  const filteredBySearch = events.filter((event) =>
    event.title.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Filter events op basis van de geselecteerde categorie
  const filteredEvents = filteredBySearch.filter((event) => {
    // Als de geselecteerde categorie leeg is, neem dan alle evenementen mee
    if (!selectedCategory) return true;

    // Zorg ervoor dat event.categoryIds een array is van strings
    if (!event.categoryIds || !Array.isArray(event.categoryIds)) {
      return true;
    }

    // Als de geselecteerde categorie een string is en categoryIds een array van strings is,
    // dan moet de filter kijken of de geselecteerde categorie voorkomt in categoryIds.
    return event.categoryIds.some(
      (categoryId) => String(categoryId) === String(selectedCategory)
    );
  });

  if (!events || !categories) {
    return (
      <Box
        display="flex"
        justifyContent="center"
        alignItems="center"
        height="100vh"
      >
        <Spinner size="xl" />
      </Box>
    );
  }

  return (
    <Container maxW="container.xl" py={10}>
      <Heading as="h1" size="xl" mb={8} textAlign="center">
        Events
      </Heading>

      {/* Voeg SearchBar en EventFilter toe */}
      <SearchBar searchTerm={searchTerm} onSearchChange={setSearchTerm} />
      <EventFilter
        categories={categories}
        selectedCategory={selectedCategory}
        onCategoryChange={setSelectedCategory}
      />

      <Button colorScheme="blue" mb={4} onClick={handleModalOpen}>
        Add Event
      </Button>

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

      <EventModal
        isOpen={isModalOpen}
        onClose={handleModalClose}
        categories={categories}
        onEventAdded={handleAddEvent}
      />
    </Container>
  );
};
