// EventCard.jsx
import React from "react";
import { Box, Image, Text, Flex, Badge } from "@chakra-ui/react";
import { Link } from "react-router-dom";

const EventCard = ({
  id,
  title,
  description,
  image,
  startTime,
  endTime,
  categories,
}) => {
  // Function to format date into a readable string
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return `${date.toLocaleDateString()} ${date.toLocaleTimeString()}`;
  };

  return (
    <Link to={`/event/${id}`}>
      {/* Dynamically create the URL for each event */}
      <Box
        borderWidth="1px"
        borderRadius="lg"
        overflow="hidden"
        boxShadow="md"
        bg="white"
        p={4}
        _hover={{
          cursor: "pointer", // Show a pointer cursor when hovering over the card
          transform: "scale(1.05)", // Slightly scale up the card on hover
          transition: "all 0.3s ease", // Smooth transition for scaling
        }}
      >
        <Image
          src={image} // Image of the event
          alt={title} // Alt text for the image
          borderRadius="md"
          mb={4}
          width="100%"
          height="200px"
          objectFit="cover" // Cover the box without distortion
        />
        <Text fontSize="xl" fontWeight="bold" mb={2}>
          {title} {/* Display the title of the event */}
        </Text>
        <Text fontSize="md" color="gray.600" mb={4}>
          {description} {/* Display the event description */}
        </Text>
        <Text fontSize="sm" color="gray.500" mb={2}>
          {/* Display start and end times of the event */}
          <strong>Start:</strong> {formatDate(startTime)} <br />
          <strong>End:</strong> {formatDate(endTime)}
        </Text>

        <Flex wrap="wrap" mt={2}>
          {/* Map through categories and display each as a badge */}
          {categories.map((category, index) => (
            <Badge key={index} colorScheme="blue" mr={2} mb={2}>
              {category}
            </Badge>
          ))}
        </Flex>
      </Box>
    </Link>
  );
};

export default EventCard;
