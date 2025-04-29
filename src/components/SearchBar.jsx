// components/SearchBar.jsx
import React from "react";
import { Input, Box } from "@chakra-ui/react";

const SearchBar = ({ searchTerm, onSearchChange }) => {
  return (
    <Box mb={4}>
      <Input
        type="text"
        placeholder="Search events..."
        value={searchTerm}
        onChange={(e) => onSearchChange(e.target.value)}
        size="lg"
      />
    </Box>
  );
};

export default SearchBar;
