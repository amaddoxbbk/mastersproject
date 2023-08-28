import React, { useState } from "react";
import { Box, Button, FormControl, FormLabel, Input } from "@chakra-ui/react";
import { useNavigate } from "react-router-dom";
import { ReusableModal } from "./components/ReusableModal";
import WriteData from "./components/WriteData"; // Step 1: Import WriteData

export const Register = () => {
  console.log("Register page");

  const navigate = useNavigate();

  // State variables for modals and event details
  const [isOpenNew, setIsOpenNew] = useState(false);
  const [eventName, setEventName] = useState("");
  const [eventDate, setEventDate] = useState("");
  const [eventLocation, setEventLocation] = useState("");

  // State variables for finding an existing event
  const [isOpenFind, setIsOpenFind] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  // Step 2: State variable to control writing data
  const [shouldWriteData, setShouldWriteData] = useState(false);
  console.log("WriteData: ", shouldWriteData);

  const [errorMessage, setErrorMessage] = useState("");

  // Function to handle new event submission
  const handleNewEventSubmit = () => {
    if (!eventName || !eventDate || !eventLocation) {
      setErrorMessage("All fields are required");
      return;
    }

    setErrorMessage(""); // Clear any existing error messages
    console.log("handleNewEventSubmit called");
    setIsOpenNew(false);
    setShouldWriteData(true);
    console.log("Immediate Check on ShouldWriteData: ", shouldWriteData);
  };

  // Function to handle finding an existing event
  const handleFindEventSubmit = () => {
    // Logic to handle the search query for finding an event
    setIsOpenFind(false);
  };

  // Define the form for adding a new event
  const newEventForm = (
    <>
      {errorMessage && <div style={{ color: "red" }}>{errorMessage}</div>}
      <FormControl>
        <FormLabel>Event Name</FormLabel>
        <Input
          value={eventName}
          onChange={(e) => setEventName(e.target.value)}
        />
      </FormControl>
      <FormControl>
        <FormLabel>Event Date</FormLabel>
        <Input
          type="date"
          value={eventDate}
          onChange={(e) => setEventDate(e.target.value)}
        />
      </FormControl>
      <FormControl>
        <FormLabel>Event Location</FormLabel>
        <Input
          value={eventLocation}
          onChange={(e) => setEventLocation(e.target.value)}
        />
      </FormControl>
    </>
  );

  // Define the form for finding an existing event
  const findEventForm = (
    <FormControl>
      <FormLabel>Search for Event</FormLabel>
      <Input
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
      />
    </FormControl>
  );

  return (
    <Box p={8}>
      <Button mt={4} onClick={() => setIsOpenNew(true)}>
        Create New Event
      </Button>

      <Button mt={4} ml={4} onClick={() => setIsOpenFind(true)}>
        Find Existing Event
      </Button>

      <ReusableModal
        isOpen={isOpenNew}
        onClose={() => setIsOpenNew(false)}
        title="Create New Event"
        handleSubmit={handleNewEventSubmit}
      >
        {newEventForm}
      </ReusableModal>

      <ReusableModal
        isOpen={isOpenFind}
        onClose={() => setIsOpenFind(false)}
        title="Find Existing Event"
        handleSubmit={handleFindEventSubmit}
      >
        {findEventForm}
      </ReusableModal>

      {shouldWriteData && (
        <WriteData
          endpoint="/api/addEvent" // Your API endpoint for adding a new event
          payload={{
            event_name: eventName,
            event_date: eventDate,
            event_location: eventLocation,
          }}
          onSuccess={() => {
            console.log("Event added successfully");
            setShouldWriteData(false); // Reset the trigger
            navigate("/main"); // Navigate to the main page
          }}
          onFailure={(error) => {
            console.error("There was an error adding the event", error);
            setShouldWriteData(false); // Reset the trigger
          }}
        />
      )}
    </Box>
  );
};
