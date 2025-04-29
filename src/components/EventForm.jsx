// components/EventForm.jsx
import React, { useState, useEffect } from "react";
import {
  FormControl,
  FormLabel,
  Input,
  Textarea,
  Button,
  Checkbox,
  HStack,
} from "@chakra-ui/react";

const EventForm = ({
  onSubmit, // Function to handle form submission
  categories = [], // List of available categories
  users = [], // List of available users for event creation
  initialData = null, // Data for editing an existing event (if any)
}) => {
  // Initialize form data
  const [formData, setFormData] = useState(
    initialData || {
      title: "",
      description: "",
      location: "",
      startTime: "",
      endTime: "",
      image: "",
      categoryIds: [],
      createdBy: "", // Add createdBy to track the user who created the event
    }
  );

  // Effect to update formData if initialData is provided (for editing an event)
  useEffect(() => {
    if (initialData) {
      setFormData({
        title: initialData.title,
        description: initialData.description,
        location: initialData.location,
        startTime: formatDateForInput(initialData.startTime),
        endTime: formatDateForInput(initialData.endTime),
        image: initialData.image,
        categoryIds: initialData.categoryIds,
        createdBy: initialData.createdBy, // Keep createdBy unchanged when editing
      });
    }
  }, [initialData]);

  // Handle input field changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  // Handle category checkbox changes
  const handleCategoryChange = (e) => {
    const { value, checked } = e.target;
    setFormData((prevData) => {
      const val = Number(value);
      let newCategoryIds = [...prevData.categoryIds];
      if (checked) {
        if (!newCategoryIds.includes(val)) {
          newCategoryIds.push(val);
        }
      } else {
        newCategoryIds = newCategoryIds.filter((id) => id !== val);
      }
      return {
        ...prevData,
        categoryIds: newCategoryIds,
      };
    });
  };

  // Handle form submission
  const handleSubmit = (e) => {
    e.preventDefault();

    // Check if all required fields are filled in
    if (
      !formData.title ||
      !formData.description ||
      formData.categoryIds.length === 0 ||
      (!initialData && !formData.createdBy) // Check if createdBy is selected for new events
    ) {
      alert(
        "Please fill in all required fields, and select at least one category and a user (only for new events)."
      );
      return;
    }

    // Format dates to ISO string format for submission
    const formattedData = {
      ...formData,
      startTime: new Date(formData.startTime).toISOString(),
      endTime: new Date(formData.endTime).toISOString(),
    };

    console.log("Formatted form data with selected user:", formattedData);

    // Call the onSubmit function with the formatted data
    onSubmit(formattedData);

    // Reset the form after successful submit
    setFormData({
      title: "",
      description: "",
      location: "",
      startTime: "",
      endTime: "",
      image: "",
      categoryIds: [],
      createdBy: "", // Reset createdBy
    });
  };

  // Format date to match the input format 'YYYY-MM-DDTHH:MM'
  const formatDateForInput = (dateString) => {
    const date = new Date(dateString);
    return date.toISOString().slice(0, 16); // Format as 'YYYY-MM-DDTHH:MM'
  };

  return (
    <form onSubmit={handleSubmit}>
      {/* Title Input */}
      <FormControl mb={4} isRequired>
        <FormLabel>Title</FormLabel>
        <Input
          type="text"
          name="title"
          value={formData.title}
          onChange={handleChange}
        />
      </FormControl>

      {/* Description Input */}
      <FormControl mb={4} isRequired>
        <FormLabel>Description</FormLabel>
        <Textarea
          name="description"
          value={formData.description}
          onChange={handleChange}
        />
      </FormControl>

      {/* Location Input */}
      <FormControl mb={4} isRequired>
        <FormLabel>Location</FormLabel>
        <Input
          type="text"
          name="location"
          value={formData.location}
          onChange={handleChange}
        />
      </FormControl>

      {/* Start Time Input */}
      <FormControl mb={4} isRequired>
        <FormLabel>Start Time</FormLabel>
        <Input
          type="datetime-local"
          name="startTime"
          value={formData.startTime}
          onChange={handleChange}
        />
      </FormControl>

      {/* End Time Input */}
      <FormControl mb={4} isRequired>
        <FormLabel>End Time</FormLabel>
        <Input
          type="datetime-local"
          name="endTime"
          value={formData.endTime}
          onChange={handleChange}
        />
      </FormControl>

      {/* Image URL Input */}
      <FormControl mb={4} isRequired>
        <FormLabel>Image URL</FormLabel>
        <Input
          type="text"
          name="image"
          value={formData.image}
          onChange={handleChange}
        />
      </FormControl>

      {/* Category Checkboxes */}
      <FormControl mb={4}>
        <FormLabel>Categories</FormLabel>
        <HStack spacing={4} wrap="wrap">
          {categories.map((category) => (
            <Checkbox
              key={category.id}
              value={category.id}
              onChange={handleCategoryChange}
              isChecked={formData.categoryIds.includes(category.id)}
            >
              {category.name}
            </Checkbox>
          ))}
        </HStack>
      </FormControl>

      {/* User Selection for New Events */}
      {!initialData && (
        <FormControl mb={4} isRequired>
          <FormLabel>Created By</FormLabel>
          <select
            name="createdBy"
            value={formData.createdBy}
            onChange={handleChange}
          >
            <option value="">Select a user</option>
            {users.map((user) => (
              <option key={user.id} value={user.id}>
                {user.name}
              </option>
            ))}
          </select>
        </FormControl>
      )}

      {/* Submit Button */}
      <Button type="submit" colorScheme="blue" width="full">
        {initialData ? "Update Event" : "Add Event"}
      </Button>
    </form>
  );
};

export default EventForm;
