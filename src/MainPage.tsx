import React, { useState, useEffect } from "react";
import { List, ListItem, Box } from "@chakra-ui/react";
import { AddGuestButton } from "./components/AddGuestButton";
import { useEvent } from "./components/EventContext";
import axios from "axios";

export const MainPage = () => {
  const { eventData } = useEvent();
  const [guests, setGuests] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(false); // Loading state

  // Function to fetch guests from the database
  const fetchGuests = async () => {
    setIsLoading(true); // Set loading state to true before fetching
    try {
      const response = await axios.post("/api/getGuests", {
        event_id: eventData.event_id,
      });
      setGuests(response.data);
    } catch (error) {
      console.error("Error fetching guests:", error);
    }
    setIsLoading(false); // Set loading state to false after fetching
  };

  useEffect(() => {
    // Fetch guests when the component mounts or eventData.event_id changes
    if (eventData.event_id) {
      fetchGuests();
    }
  }, [eventData.event_id]);

  const addGuestToList = async (name: string) => {
    // refetch the list of guests to update the UI
    await fetchGuests();
  };

  return (
    <Box p={8}>
      <h1>Welcome to {eventData.event_name}</h1>
      <h2>Event ID: {eventData.event_id}</h2>
      <AddGuestButton addGuestToList={addGuestToList} guests={guests} />
      <List mt={4}>
        {isLoading ? (
          <ListItem>Loading...</ListItem>
        ) : guests.length > 0 ? (
          guests.map((guest, index) => (
            <ListItem key={index}>{guest.attendee_name}</ListItem>
          ))
        ) : (
          <ListItem>No guests added yet</ListItem>
        )}
      </List>
    </Box>
  );
};
