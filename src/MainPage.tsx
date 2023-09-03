import React, { useState, useEffect } from "react";
import { List, ListItem, Box, Text } from "@chakra-ui/react";
import { AddGuestButton } from "./components/AddGuestButton";
import { AddCoupleButton } from "./components/AddCoupleButton";
import { useEvent } from "./components/EventContext";
import axios from "axios";
import { RemoveGuestButton } from "./components/RemoveGuestButton";

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

  const brideCount = guests.filter((guest) => guest.is_bride === true).length;
  const groomCount = guests.filter((guest) => guest.is_groom === true).length;

  return (
    <Box p={8}>
      <h1>Welcome to {eventData.event_name}</h1>
      <h2>Event ID: {eventData.event_id}</h2>
      <Text>Number of Brides: {brideCount}</Text>
      <Text>Number of Grooms: {groomCount}</Text>
      <AddGuestButton guests={guests} setShouldRefetch={setShouldRefetch} />
      {(brideCount + groomCount !== 2) && (
        <AddCoupleButton setShouldRefetch={setShouldRefetch} />
      )}      <RemoveGuestButton guests={guests} setShouldRefetch={setShouldRefetch} />
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