import React, { useState } from "react";
import {
  FormControl,
  FormLabel,
  Input,
  Textarea,
  Button,
  Checkbox,
  HStack,
} from "@chakra-ui/react";

const EventForm = ({ onSubmit, categories = [], initialData = null }) => {
  const [formData, setFormData] = useState(
    initialData || {
      title: "",
      description: "",
      location: "",
      startTime: "",
      endTime: "",
      image: "",
      categoryIds: [],
    }
  );

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleCategoryChange = (e) => {
    const { value, checked } = e.target;
    setFormData((prevData) => {
      let newCategoryIds = [...prevData.categoryIds];
      if (checked) {
        newCategoryIds.push(parseInt(value));
      } else {
        newCategoryIds = newCategoryIds.filter((id) => id !== parseInt(value));
      }
      return {
        ...prevData,
        categoryIds: newCategoryIds,
      };
    });
  };

  const getRandomUserId = () => {
    const randomIndex = Math.floor(Math.random() * users.length);
    return users[randomIndex].id;
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (
      !formData.title ||
      !formData.description ||
      formData.categoryIds.length === 0
    ) {
      alert(
        "Please fill in all required fields, and select at least one category."
      );
      return;
    }

    const formattedData = {
      ...formData,
      startTime: new Date(formData.startTime).toISOString(),
      endTime: new Date(formData.endTime).toISOString(),
      createdBy: getRandomUserId(), // <-- hier voegen we de random user toe
    };

    console.log("Formatted form data with random user:", formattedData);

    onSubmit(formattedData);

    setFormData({
      title: "",
      description: "",
      location: "",
      startTime: "",
      endTime: "",
      image: "",
      categoryIds: [],
    });
  };

  return (
    <form onSubmit={handleSubmit}>
      <FormControl mb={4} isRequired>
        <FormLabel>Title</FormLabel>
        <Input
          type="text"
          name="title"
          value={formData.title}
          onChange={handleChange}
        />
      </FormControl>

      <FormControl mb={4} isRequired>
        <FormLabel>Description</FormLabel>
        <Textarea
          name="description"
          value={formData.description}
          onChange={handleChange}
        />
      </FormControl>

      <FormControl mb={4} isRequired>
        <FormLabel>Location</FormLabel>
        <Input
          type="text"
          name="location"
          value={formData.location}
          onChange={handleChange}
        />
      </FormControl>

      <FormControl mb={4} isRequired>
        <FormLabel>Start Time</FormLabel>
        <Input
          type="datetime-local"
          name="startTime"
          value={formData.startTime}
          onChange={handleChange}
        />
      </FormControl>

      <FormControl mb={4} isRequired>
        <FormLabel>End Time</FormLabel>
        <Input
          type="datetime-local"
          name="endTime"
          value={formData.endTime}
          onChange={handleChange}
        />
      </FormControl>

      <FormControl mb={4} isRequired>
        <FormLabel>Image URL</FormLabel>
        <Input
          type="text"
          name="image"
          value={formData.image}
          onChange={handleChange}
        />
      </FormControl>

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

      <Button type="submit" colorScheme="blue" width="full">
        Add Event
      </Button>
    </form>
  );
};

export default EventForm;
