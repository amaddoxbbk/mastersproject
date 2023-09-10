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

  const fetchData = async () => {
    try {
      const guestsResponse = await axios.post("/api/getGuests", {
        event_id: eventData.event_id,
      });
      setGuests(guestsResponse.data);

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
    setTopTableGuests(selectedTopTableGuests);
    handleModalClose();
  };
  

  const handleGuestSelect = (guestName: string) => {
    if (selectedTopTableGuests.includes(guestName)) {
      setSelectedTopTableGuests(
        selectedTopTableGuests.filter((item) => item !== guestName)
      );
    } else {
      setSelectedTopTableGuests([...selectedTopTableGuests, guestName]);
    }
  };

  const availableGuestOptions = guests
    .filter((guest) => !selectedTopTableGuests.includes(guest.attendee_name))
    .map((guest) => ({
      value: guest.attendee_name,
      label: guest.attendee_name,
    }));

  const removeTopTableGuest = (name: string) => {
    setSelectedTopTableGuests(
      selectedTopTableGuests.filter((item) => item !== name)
    );
  };

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
    options={availableGuestOptions}
    title="Select Guests"
  />
  {selectedTopTableGuests.length > 0 && (
    <HStack mt={2} spacing={4}>
      {selectedTopTableGuests.map((name, index) => (
        <Tag
          size="md"
          key={index}
          variant="solid"
          colorScheme="blue"
        >
          <TagLabel>{name}</TagLabel>
          <TagCloseButton
            onClick={() => removeTopTableGuest(name)}
          />
        </Tag>
      ))}
    </HStack>
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
