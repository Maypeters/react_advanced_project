// components/EventFilter.jsx
import React from "react";
import { Select, Box, FormLabel } from "@chakra-ui/react";

const EventFilter = ({ categories, selectedCategory, onCategoryChange }) => {
  return (
    <Box mb={4}>
      <FormLabel htmlFor="category-filter">Filter by Category</FormLabel>
      <Select
        id="category-filter" // ID for the select element
        value={selectedCategory} // The currently selected category
        onChange={(e) => onCategoryChange(e.target.value)} // Update the category when changed
        placeholder="Select a category" // Placeholder text when no category is selected
        size="lg" // Larger size for the select input
      >
        {/* Map through categories and display each as an option */}
        {categories.map((category) => (
          <option key={category.id} value={category.id}>
            {category.name} {/* Category name displayed */}
          </option>
        ))}
      </Select>
    </Box>
  );
};

export default EventFilter;
