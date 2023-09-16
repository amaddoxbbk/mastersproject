import React, { useState, useEffect } from "react";
import {
  Box,
  Text,
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  HStack,
  Button,
} from "@chakra-ui/react";
import { AddGuestButton } from "./components/AddGuestButton";
import { AddCoupleButton } from "./components/AddCoupleButton";
import { useEvent } from "./components/EventContext";
import axios from "axios";
import { RemoveGuestButton } from "./components/RemoveGuestButton";
import { RemoveCoupleButton } from "./components/RemoveCoupleButton";
import { EditExistingEventButton } from "./components/EditExistingEventButton";
import { useNavigate } from "react-router-dom";
import { ReusableModal } from "./components/ReusableModal";

export const MainPage = () => {
  const navigate = useNavigate();
  const { eventData } = useEvent();
  const [guests, setGuests] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [shouldRefetch, setShouldRefetch] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [eventInfo, setEventInfo] = useState<any>(null);

  const fetchData = async () => {
    try {
      const eventInfoResponse = await axios.post("/api/getOneEvent", {
        event_id: eventData.event_id,
      });
      setEventInfo(eventInfoResponse.data);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  const fetchAllData = async () => {
    setIsLoading(true);
    try {
      const [guestsResponse, eventInfoResponse] = await Promise.all([
        axios.post("/api/getGuests", {
          event_id: eventData.event_id,
        }),
        axios.post("/api/getOneEvent", {
          event_id: eventData.event_id,
        }),
      ]);

      setGuests(guestsResponse.data);
      setEventInfo(eventInfoResponse.data);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
    setIsLoading(false);
  };

  useEffect(() => {
    if (shouldRefetch || eventData.event_id) {
      fetchAllData(); // This will now fetch both guests and event information
      setShouldRefetch(false);
    }
  }, [shouldRefetch, eventData.event_id]);

  const brideCount = guests.filter((guest) => guest.is_bride === true).length;
  const groomCount = guests.filter((guest) => guest.is_groom === true).length;
  const guestCount = guests.length - brideCount - groomCount;
  const couple = guests
    .filter((guest) => guest.is_bride === true || guest.is_groom === true)
    .map((guest) => guest.attendee_name);

  const {
    num_top_tables,
    size_top_tables,
    num_normal_tables,
    size_normal_tables,
  } = eventInfo || {};

  console.log(eventInfo);

  const totalEventCapacity =
    num_top_tables * size_top_tables + num_normal_tables * size_normal_tables;

  console.log(totalEventCapacity);

  const hasTooManyGuests = () => {
    const totalGuests = guestCount + 2; // including bride and groom
    return totalGuests > totalEventCapacity;
  };

  return (
    <Box p={8}>
      <h1>Welcome to {eventData.event_name}</h1>
      <h2>Event ID: {eventData.event_id}</h2>
      <h2>Welcome To The Wedding Of: {couple.join(" and ")}</h2>
      <Text>Number of Brides: {brideCount}</Text>
      <Text>Number of Grooms: {groomCount}</Text>
      <Text>Number of Guests: {guestCount}</Text>
      <HStack spacing={4} mt={4}>
        {brideCount + groomCount !== 2 && (
          <AddCoupleButton setShouldRefetch={setShouldRefetch} />
        )}{" "}
        {brideCount + groomCount === 2 && guestCount === 0 && (
          <RemoveCoupleButton setShouldRefetch={setShouldRefetch} />
        )}{" "}
        {brideCount + groomCount === 2 && (
          <AddGuestButton guests={guests} setShouldRefetch={setShouldRefetch} />
        )}{" "}
        {brideCount + groomCount === 2 && guestCount > 0 && (
          <RemoveGuestButton
            guests={guests}
            setShouldRefetch={setShouldRefetch}
          />
        )}
        return (
        <>
          <Button
            onClick={() => {
              if (hasTooManyGuests()) {
                setIsModalOpen(true);
              } else {
                navigate("/plan-builder");
              }
            }}
          >
            Go To Plan Builder
          </Button>
          {isModalOpen && (
            <ReusableModal
              isOpen={isModalOpen}
              onClose={() => setIsModalOpen(false)}
              title="Warning"
              handleSubmit={() => setIsModalOpen(false)}
            >
              <p>
                The total capacity for this event is {totalEventCapacity} but
                you have {guestCount + 2} guests. Please remove{" "}
                {guestCount + 2 - totalEventCapacity} guests before continuing.
              </p>
            </ReusableModal>
          )}
        </>
        );
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
            guests
              .filter((guest) => !guest.is_groom && !guest.is_bride) // Filter out guests who are the groom or bride
              .filter((guest) => !guest.partner_to) // Filter out guests who are plus ones
              .map((guest, index) => (
                <Tr key={index}>
                  <Td>{guest.attendee_name}</Td>
                  <Td>{guest.relationship || "-"}</Td>
                  <Td>
                    {guests.find(
                      (plusOne) => plusOne.partner_to === guest.attendee_id
                    )?.attendee_name || "-"}
                  </Td>
                  <Td>
                    {
                      // Find the names of the attendees that this guest cannot sit with
                      guest.blacklist_attendee_ids &&
                      guest.blacklist_attendee_ids.length > 0
                        ? guest.blacklist_attendee_ids
                            .map(
                              (id: number) =>
                                guests.find((g) => g.attendee_id === id)
                                  ?.attendee_name
                            )
                            .filter(Boolean)
                            .join(", ") || "-"
                        : "-"
                    }
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
