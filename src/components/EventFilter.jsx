// components/EventFilter.jsx
import React from "react";
import { Select, Box, FormLabel } from "@chakra-ui/react";

const EventFilter = ({ categories, selectedCategory, onCategoryChange }) => {
  return (
    <Box mb={4}>
      <FormLabel htmlFor="category-filter">Filter by Category</FormLabel>
      <Select
        id="category-filter"
        value={selectedCategory}
        onChange={(e) => onCategoryChange(e.target.value)} // Update the category when changed
        placeholder="Select a category"
        size="lg"
      >
        {categories.map((category) => (
          <option key={category.id} value={category.id}>
            {category.name}
          </option>
        ))}
      </Select>
    </Box>
  );
};

export default EventFilter;
