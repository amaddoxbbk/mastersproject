import React, { useState, useEffect } from "react";
import { List, ListItem, Box } from "@chakra-ui/react";
import { AddGuestButton } from "./components/AddGuestButton";
import { AddCoupleButton } from "./components/AddCoupleButton";
import { useEvent } from "./components/EventContext";
import axios from "axios";

export const MainPage = () => {
  const { eventData } = useEvent();
  const [guests, setGuests] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [shouldRefetch, setShouldRefetch] = useState(false);

  const fetchGuests = async () => {
    setIsLoading(true);
    try {
      const response = await axios.post("/api/getGuests", {
        event_id: eventData.event_id,
      });
      setGuests(response.data);
    } catch (error) {
      console.error("Error fetching guests:", error);
    }
    setIsLoading(false);
  };

  useEffect(() => {
    if (shouldRefetch || eventData.event_id) {
      fetchGuests();
      setShouldRefetch(false);
    }
  }, [shouldRefetch, eventData.event_id]);

  return (
    <Box p={8}>
      <h1>Welcome to {eventData.event_name}</h1>
      <h2>Event ID: {eventData.event_id}</h2>
      <AddGuestButton guests={guests} setShouldRefetch={setShouldRefetch} />
      <AddCoupleButton setShouldRefetch={setShouldRefetch} />
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
