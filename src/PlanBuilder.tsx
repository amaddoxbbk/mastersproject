import React, { useEffect, useState } from "react";
import { useEvent } from "./components/EventContext";
import axios from "axios";
import {
  Button,
  Grid,
  GridItem,
  HStack,
  Text,
  Show,
  Tag,
  TagLabel,
  TagCloseButton,
} from "@chakra-ui/react";
import { useNavigate } from "react-router-dom";
import { EditExistingEventButton } from "./components/EditExistingEventButton";
import "font-awesome/css/font-awesome.min.css";
import TableGrid from "./components/TableGrid";
import { createTableData } from "./utilities/tableUtils";
import { ReusableModal } from "./components/ReusableModal";
import GenericDropdown from "./components/GenericDropdown";
import { Flex } from "@chakra-ui/react";
import { z } from "zod";

interface TableData {
  title: string;
  names: string[];
}

const PlanBuilder = () => {
  const { eventData } = useEvent();
  const [guests, setGuests] = useState<any[]>([]);
  const [eventInfo, setEventInfo] = useState<any>(null);
  const navigate = useNavigate();
  const [shouldRefetch, setShouldRefetch] = useState(false);
  const manuallySelectedTopTableNames = ["Andrew Maddox"];
  const filteredGuests = guests.filter(
    (guest) => !manuallySelectedTopTableNames.includes(guest.attendee_name)
  );
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedTopTableGuests, setSelectedTopTableGuests] = useState<
    string[]
  >([]);
  const [topTableGuests, setTopTableGuests] = useState<string[]>([]);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const fetchData = async () => {
    try {
      const guestsResponse = await axios.post("/api/getGuests", {
        event_id: eventData.event_id,
      });

      // Filter out the bride and groom
      const filteredGuestsResponse = guestsResponse.data.filter(
        (guest: any) => !guest.is_bride && !guest.is_groom
      );

      setGuests(guestsResponse.data);

      const brideAndGroom = guestsResponse.data
        .filter((guest: any) => guest.is_bride || guest.is_groom)
        .map((guest: any) => guest.attendee_name);

      setTopTableGuests(brideAndGroom);

      const eventInfoResponse = await axios.post("/api/getOneEvent", {
        event_id: eventData.event_id,
      });
      setEventInfo(eventInfoResponse.data);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  useEffect(() => {
    fetchData();
    if (shouldRefetch) {
      setShouldRefetch(false);
    }
  }, [shouldRefetch]);

  const {
    num_top_tables,
    size_top_tables,
    num_normal_tables,
    size_normal_tables,
  } = eventInfo || {};

  const sizeNormalTablesNumber = parseInt(size_normal_tables, 10);
  const sizeTopTableNumber = parseInt(size_top_tables, 10);

  const topTableSchema = z.object({
    topTableGuests: z.array(z.string()).max(sizeTopTableNumber),
  });

  const tableData = createTableData(
    filteredGuests,
    sizeNormalTablesNumber,
    sizeTopTableNumber,
    topTableGuests // Pass the state variable here
  );

  const handleModalClose = () => {
    setIsModalOpen(false);
  };

  const handleModalSubmit = () => {
    // Always include the bride and groom in the top table
    const brideAndGroom = guests
      .filter((guest) => guest.is_bride === true || guest.is_groom === true)
      .map((guest) => guest.attendee_name);

    // Combine the selected top table guests with the bride and groom
    const allTopTableGuests = [
      ...new Set([...selectedTopTableGuests, ...brideAndGroom]),
    ];

    // Validate using Zod
    const validationResult = topTableSchema.safeParse({
      topTableGuests: allTopTableGuests,
    });

    if (validationResult.success) {
      setTopTableGuests(allTopTableGuests);
      handleModalClose();
      setErrorMessage(null); // Clear any existing error messages
    } else {
      // Calculate the number of excess guests
      const excessGuests = allTopTableGuests.length - sizeTopTableNumber;
      // Set the validation error message
      setErrorMessage(
        `Too many guests for the top table. Please remove ${excessGuests} guests.`
      );
    }
  };

  const handleGuestSelect = (guestName: string) => {
    // Create a bidirectional mapping for quick look-up
    const partnerMapping: { [key: string]: string | null } = {};
    const reversePartnerMapping: { [key: string]: string | null } = {};

    guests.forEach((guest) => {
      partnerMapping[guest.attendee_name] = guest.partner_to
        ? guests.find((g) => g.attendee_id === guest.partner_to)?.attendee_name
        : null;
      if (guest.partner_to) {
        reversePartnerMapping[
          guests.find((g) => g.attendee_id === guest.partner_to)
            ?.attendee_name || ""
        ] = guest.attendee_name;
      }
    });

    // Find the partner of the selected guest
    const partnerName =
      partnerMapping[guestName] || reversePartnerMapping[guestName] || null;

    let updatedTopTableGuests = [...selectedTopTableGuests];

    if (selectedTopTableGuests.includes(guestName)) {
      // Remove the guest and their partner
      updatedTopTableGuests = updatedTopTableGuests.filter(
        (name) => name !== guestName && name !== partnerName
      );
    } else {
      // Add the guest and their partner
      updatedTopTableGuests.push(guestName);
      if (partnerName) {
        updatedTopTableGuests.push(partnerName);
      }
    }

    setSelectedTopTableGuests(updatedTopTableGuests);
  };

  const availableGuestOptions = guests
    .filter((guest) => !selectedTopTableGuests.includes(guest.attendee_name))
    .filter((guest) => !guest.is_bride && !guest.is_groom) // Exclude bride and groom here
    .map((guest) => ({
      value: guest.attendee_name,
      label: guest.attendee_name,
    }));

  const removeTopTableGuest = (name: string) => {
    // Create a bidirectional mapping for quick look-up
    const partnerMapping: { [key: string]: string | null } = {};
    const reversePartnerMapping: { [key: string]: string | null } = {};

    guests.forEach((guest) => {
      partnerMapping[guest.attendee_name] = guest.partner_to
        ? guests.find((g) => g.attendee_id === guest.partner_to)?.attendee_name
        : null;
      if (guest.partner_to) {
        reversePartnerMapping[
          guests.find((g) => g.attendee_id === guest.partner_to)
            ?.attendee_name || ""
        ] = guest.attendee_name;
      }
    });

    // Find the partner of the selected guest
    const partnerName =
      partnerMapping[name] || reversePartnerMapping[name] || null;

    let updatedTopTableGuests = [...selectedTopTableGuests];

    // Remove the guest and their partner
    updatedTopTableGuests = updatedTopTableGuests.filter(
      (guestName) => guestName !== name && guestName !== partnerName
    );

    setSelectedTopTableGuests(updatedTopTableGuests);
  };

  const sortedAvailableGuestOptions = [...availableGuestOptions].sort((a, b) => {
    if (a.label < b.label) {
      return -1;
    }
    if (a.label > b.label) {
      return 1;
    }
    return 0;
  });
  

  return (
    <>
      <Grid
        templateAreas={{
          base: `"nav" "aside" "main"`,
          lg: `"nav nav" "aside main"`,
        }}
        templateColumns={{
          base: "1fr",
          lg: "225px 1fr",
        }}
      >
        <GridItem area="nav">
          <HStack
            mt={6}
            mb={2}
            ml={2}
            width="100%"
            justifyContent="space-between"
          >
            <HStack spacing={3}>
              <Button onClick={() => navigate("/home")}>
                <i className="fa fa-home" style={{ fontSize: "30px" }}></i>
              </Button>
              <Show above="lg">
                <Text fontSize="2xl" fontWeight="bold" color="black">
                  Welcome to {eventData.event_name}
                </Text>
              </Show>
            </HStack>
            <HStack spacing={3} mr={6}>
              <EditExistingEventButton setShouldRefetch={setShouldRefetch} />
              <Button onClick={() => navigate("/main")}>Go Back To List</Button>
            </HStack>
          </HStack>
        </GridItem>
        <GridItem area="aside" mt={4}>
          <div>
            <h2>Event ID: {eventData.event_id}</h2>
            <h2>Number of Top Tables: {num_top_tables}</h2>
            <h2>Size of Top Tables: {size_top_tables}</h2>
            <h2>Number of Normal Tables: {num_normal_tables}</h2>
            <h2>Size of Normal Tables: {size_normal_tables}</h2>
          </div>
          <Button onClick={() => setIsModalOpen(true)}>
            Assign Top Tablel
          </Button>
          <ReusableModal
            isOpen={isModalOpen}
            onClose={handleModalClose}
            title="Select Top Table Guests"
            handleSubmit={handleModalSubmit}
          >
            <GenericDropdown
              onSelect={handleGuestSelect}
              selectedValue={selectedTopTableGuests}
              options={sortedAvailableGuestOptions}
              title="Select Guests"
            />
            {errorMessage && <Text color="red.500">{errorMessage}</Text>}
            {selectedTopTableGuests.length > 0 && (
              <Flex mt={2} flexWrap="wrap">
                {" "}
                {/* Use Flex and set flexWrap to "wrap" */}
                {selectedTopTableGuests.map((name, index) => (
                  <Tag
                    size="md"
                    key={index}
                    variant="solid"
                    colorScheme="blue"
                    m={1}
                  >
                    <TagLabel>{name}</TagLabel>
                    <TagCloseButton onClick={() => removeTopTableGuest(name)} />
                  </Tag>
                ))}
              </Flex>
            )}
          </ReusableModal>
        </GridItem>
        <GridItem area="main">
          <TableGrid tables={tableData} />
        </GridItem>
      </Grid>
    </>
  );
};

export default PlanBuilder;
