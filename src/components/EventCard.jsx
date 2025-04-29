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
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return `${date.toLocaleDateString()} ${date.toLocaleTimeString()}`;
  };

  return (
    <Link to={`/event/${id}`}>
      {" "}
      {/* Dynamisch de URL voor elk evenement */}
      <Box
        borderWidth="1px"
        borderRadius="lg"
        overflow="hidden"
        boxShadow="md"
        bg="white"
        p={4}
        _hover={{
          cursor: "pointer",
          transform: "scale(1.05)",
          transition: "all 0.3s ease",
        }}
      >
        <Image
          src={image}
          alt={title}
          borderRadius="md"
          mb={4}
          width="100%"
          height="200px"
          objectFit="cover"
        />
        <Text fontSize="xl" fontWeight="bold" mb={2}>
          {title}
        </Text>
        <Text fontSize="md" color="gray.600" mb={4}>
          {description}
        </Text>
        <Text fontSize="sm" color="gray.500" mb={2}>
          <strong>Start:</strong> {formatDate(startTime)} <br />
          <strong>End:</strong> {formatDate(endTime)}
        </Text>

        <Flex wrap="wrap" mt={2}>
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
