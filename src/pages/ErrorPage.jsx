import { Box, Text, Button } from "@chakra-ui/react";
import { Link } from "react-router-dom";

function ErrorPage() {
  return (
    <Box textAlign="center" p={6}>
      <Text fontSize="xl" color="red.500">
        There was an issue fetching the data.
      </Text>
      <Button as={Link} to="/" mt={4} colorScheme="teal">
        Go back to the homepage
      </Button>
    </Box>
  );
}

export default ErrorPage;
