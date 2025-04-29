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
  onSubmit,
  categories = [],
  users = [],
  initialData = null,
}) => {
  const [formData, setFormData] = useState(
    initialData || {
      title: "",
      description: "",
      location: "",
      startTime: "",
      endTime: "",
      image: "",
      categoryIds: [],
      createdBy: "", // Voeg createdBy toe
    }
  );

  useEffect(() => {
    // Als er initialData is (bij bewerken van een event), stel dan de formData in.
    if (initialData) {
      setFormData({
        title: initialData.title,
        description: initialData.description,
        location: initialData.location,
        startTime: formatDateForInput(initialData.startTime),
        endTime: formatDateForInput(initialData.endTime),
        image: initialData.image,
        categoryIds: initialData.categoryIds,
        createdBy: initialData.createdBy, // Bij bewerken niet aanpassen
      });
    }
  }, [initialData]);

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

  const handleSubmit = (e) => {
    e.preventDefault();

    if (
      !formData.title ||
      !formData.description ||
      formData.categoryIds.length === 0 ||
      (!initialData && !formData.createdBy) // Controleer of er geen initialData is en of createdBy is ingevuld bij toevoegen
    ) {
      alert(
        "Please fill in all required fields, and select at least one category and a user (only for new events)."
      );
      return;
    }

    const formattedData = {
      ...formData,
      startTime: new Date(formData.startTime).toISOString(),
      endTime: new Date(formData.endTime).toISOString(),
    };

    console.log("Formatted form data with selected user:", formattedData);

    onSubmit(formattedData); // Deze onSubmit moet de logica aanroepen die in EventModal of een andere bovenliggende component zit

    // Reset het formulier na succesvolle submit
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

  const formatDateForInput = (dateString) => {
    const date = new Date(dateString);
    return date.toISOString().slice(0, 16); // Formatteer naar 'YYYY-MM-DDTHH:MM'
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

      {!initialData && ( // Alleen weergeven bij het toevoegen van een nieuw event
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

      <Button type="submit" colorScheme="blue" width="full">
        {initialData ? "Update Event" : "Add Event"}
      </Button>
    </form>
  );
};

export default EventForm;
