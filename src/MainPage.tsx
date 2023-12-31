import React, { useState, useEffect } from "react";
import {
  Box,
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  Grid,
  GridItem,
  VStack,
  useBreakpointValue,
  HStack,
  Center,
} from "@chakra-ui/react";
import { AddGuestButton } from "./components/AddGuestButton";
import { AddCoupleButton } from "./components/AddCoupleButton";
import { useEvent } from "./components/EventContext";
import axios from "axios";
import { RemoveGuestButton } from "./components/RemoveGuestButton";
import { RemoveCoupleButton } from "./components/RemoveCoupleButton";
import { EditExistingEventButton } from "./components/EditExistingEventButton";
import MainPageNavBar from "./components/MainPageNavBar";

export const MainPage = () => {
  const { eventData } = useEvent();
  const [guests, setGuests] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [shouldRefetch, setShouldRefetch] = useState(false);
  const [eventInfo, setEventInfo] = useState<any>(null);

  const buttonStyleAside: React.CSSProperties = {
    width: "150px",
  };

  const buttonStyleTop: React.CSSProperties = {
    width: "130px",
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
      fetchAllData();
      setShouldRefetch(false);
    }
  }, [shouldRefetch, eventData.event_id]);

  const brideCount = guests.filter((guest) => guest.is_bride === true).length;
  const groomCount = guests.filter((guest) => guest.is_groom === true).length;
  const guestCount = guests.length - brideCount - groomCount;
  const couple = guests
    .filter((guest) => guest.is_bride === true || guest.is_groom === true)
    .map((guest) => guest.attendee_name);

  return (
    <Grid
      templateAreas={{
        base: `"nav" "aside" "main"`,
        lg: `"nav nav" "aside main"`,
      }}
      templateColumns={{
        base: "1fr",
        lg: "200px 1fr",
      }}
    >
      <GridItem area="nav">
        <Box ml={4} mr={2}>
          <MainPageNavBar setShouldRefetch={setShouldRefetch} />
        </Box>
      </GridItem>

      <GridItem area="aside" mt={2}>
        <Box>
          <VStack spacing={4} mt={4} display={{ base: "none", lg: "flex" }}>
            {brideCount + groomCount !== 2 && (
              <AddCoupleButton
                setShouldRefetch={setShouldRefetch}
                style={buttonStyleAside}
              />
            )}
            {brideCount + groomCount === 2 && guestCount === 0 && (
              <RemoveCoupleButton
                setShouldRefetch={setShouldRefetch}
                style={buttonStyleAside}
              />
            )}
            {brideCount + groomCount === 2 && (
              <AddGuestButton
                guests={guests}
                setShouldRefetch={setShouldRefetch}
                style={buttonStyleAside}
              />
            )}
            {brideCount + groomCount === 2 && guestCount > 0 && (
              <RemoveGuestButton
                guests={guests}
                setShouldRefetch={setShouldRefetch}
                style={buttonStyleAside}
              />
            )}
            <EditExistingEventButton
              setShouldRefetch={setShouldRefetch}
              style={buttonStyleAside}
            />
          </VStack>
        </Box>

        <Box display="flex" justifyContent="center" alignItems="center">
          <HStack spacing={4} mt={4} display={{ base: "flex", lg: "none" }}>
            {brideCount + groomCount !== 2 && (
              <AddCoupleButton
                setShouldRefetch={setShouldRefetch}
                style={buttonStyleTop}
              />
            )}
            {brideCount + groomCount === 2 && guestCount === 0 && (
              <RemoveCoupleButton
                setShouldRefetch={setShouldRefetch}
                style={buttonStyleTop}
              />
            )}
            {brideCount + groomCount === 2 && (
              <AddGuestButton
                guests={guests}
                setShouldRefetch={setShouldRefetch}
                style={buttonStyleTop}
              />
            )}
            {brideCount + groomCount === 2 && guestCount > 0 && (
              <RemoveGuestButton
                guests={guests}
                setShouldRefetch={setShouldRefetch}
                style={buttonStyleTop}
              />
            )}
            <EditExistingEventButton
              setShouldRefetch={setShouldRefetch}
              style={buttonStyleTop}
            />
          </HStack>
        </Box>
      </GridItem>
      <GridItem area="main">
        <Box m={6}>
          <Table mt={4} variant="simple">
            <Thead bg="rgb(74, 110, 241)" >
              <Tr>
                <Th textAlign="center" color="white">
                  Guest Name
                </Th>
                <Th textAlign="center" color="white">
                  Relationship
                </Th>
                <Th textAlign="center" color="white">
                  Plus One
                </Th>
              </Tr>
            </Thead>
            <Tbody>
              {isLoading ? (
                <Tr>
                  <Td textAlign="center">Loading...</Td>
                </Tr>
              ) : guests.length > 0 ? (
                guests
                  .filter((guest) => !guest.is_groom && !guest.is_bride)
                  .filter((guest) => !guest.partner_to)
                  .map((guest, index) => (
                    <Tr key={index}>
                      <Td textAlign="center">{guest.attendee_name}</Td>
                      <Td textAlign="center">{guest.relationship || "-"}</Td>
                      <Td textAlign="center">
                        {guests.find(
                          (plusOne) => plusOne.partner_to === guest.attendee_id
                        )?.attendee_name || "-"}
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
      </GridItem>
    </Grid>
  );
};
