import React, { useState, useEffect } from "react";
import { Box, Text, Table, Thead, Tbody, Tr, Th, Td, VStack, HStack } from "@chakra-ui/react";
import { AddGuestButton } from "./components/AddGuestButton";
import { AddCoupleButton } from "./components/AddCoupleButton";
import { useEvent } from "./components/EventContext";
import axios from "axios";
import { RemoveGuestButton } from "./components/RemoveGuestButton";
import { RemoveCoupleButton } from "./components/RemoveCoupleButton";
import { EditExistingEventButton } from "./components/EditExistingEventButton";

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
  const guestCount = guests.length;

  return (
    <Box p={8}>
      <h1>Welcome to {eventData.event_name}</h1>
      <h2>Event ID: {eventData.event_id}</h2>
      <Text>Number of Brides: {brideCount}</Text>
      <Text>Number of Grooms: {groomCount}</Text>
      <Text>Number of Guests: {guestCount - groomCount - brideCount}</Text>
      <HStack spacing={4} mt={4}>
      {brideCount + groomCount !== 2 && (
        <AddCoupleButton setShouldRefetch={setShouldRefetch} />
      )}{" "}
      {brideCount + groomCount === 2 && (
        <AddGuestButton guests={guests} setShouldRefetch={setShouldRefetch} />
      )}{" "}
      {brideCount + groomCount === 2 && (
        <RemoveCoupleButton setShouldRefetch={setShouldRefetch} />
      )}{" "}
      {brideCount + groomCount === 2 && (
        <RemoveGuestButton
          guests={guests}
          setShouldRefetch={setShouldRefetch}
        />
      )}
      <EditExistingEventButton />
      </HStack>

      <Table mt={4} variant="simple">
        <Thead>
          <Tr>
            <Th>Guest Name</Th>
            <Th>Relationship</Th>
            <Th>Plus One</Th>
            <Th>Cannot Sit With</Th>
          </Tr>
        </Thead>
        <Tbody>
          {isLoading ? (
            <Tr>
              <Td>Loading...</Td>
            </Tr>
          ) : guests.length > 0 ? (
            guests.map((guest, index) => (
              <Tr key={index}>
                <Td>{guest.attendee_name}</Td>
                <Td>{guest.relationship || "-"}</Td>
                <Td>{guest.plus_one_name || "-"}</Td>
                <Td>
                  {guest.blacklist_attendee_names
                    ? guest.blacklist_attendee_names
                        .replace(/["{}]/g, "")
                        .split(",")
                        .join(", ")
                    : "-"}
                </Td>
              </Tr>
            ))
          ) : (
            <Tr>
              <Td>No guests added yet</Td>
            </Tr>
          )}
        </Tbody>
      </Table>
    </Box>
  );
};
