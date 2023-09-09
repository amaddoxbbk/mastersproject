import React, { useEffect, useState } from "react";
import { useEvent } from "./components/EventContext";
import axios from "axios";
import GuestTable from "./components/GuestTable";
import {
  Button,
  Grid,
  GridItem,
  HStack,
  Box,
  VStack,
  Text,
} from "@chakra-ui/react";
import { useNavigate } from "react-router-dom";
import { EditExistingEventButton } from "./components/EditExistingEventButton";
import "font-awesome/css/font-awesome.min.css";

const PlanBuilder = () => {
  const { eventData } = useEvent();
  const [guests, setGuests] = useState<any[]>([]);
  const [eventInfo, setEventInfo] = useState<any>(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchGuests = async () => {
      try {
        const response = await axios.post("/api/getGuests", {
          event_id: eventData.event_id,
        });
        setGuests(response.data);
      } catch (error) {
        console.error("Error fetching guests:", error);
      }
    };

    fetchGuests();
  }, []);

  useEffect(() => {
    const fetchEventInfo = async () => {
      try {
        const response = await axios.post("/api/getOneEvent", {
          event_id: eventData.event_id,
        });
        setEventInfo(response.data);
      } catch (error) {
        console.error("Error fetching event information:", error);
      }
    };

    fetchEventInfo();
  }, []);

  const {
    num_top_tables,
    size_top_tables,
    num_normal_tables,
    size_normal_tables,
  } = eventInfo || {};
  const guestNames = guests.map((guest) => guest.attendee_name);

  return (
    <>
      <Grid
        templateAreas={`
          "nav nav"
          "aside main "
        `}
      >
        <GridItem area="nav" bg="blue.500">
          <HStack mt={2} mb={2} width="100%" justifyContent="space-between">
            <HStack spacing={3}>
              <Button onClick={() => navigate("/home")}>
                <i className="fa fa-home" style={{ fontSize: "30px" }}></i>
              </Button>
              <Text fontSize="2xl" fontWeight="bold" color="white">
                Welcome to {eventData.event_name}
              </Text>
            </HStack>

            <HStack spacing={3}>
              <EditExistingEventButton />
              <Button onClick={() => navigate("/main")}>
                Go Back To List Builder
              </Button>
            </HStack>
          </HStack>
        </GridItem>

        <GridItem area="aside" bg="red.500">
          <div>
            <h2>Event ID: {eventData.event_id}</h2>
            <h2>Number of Top Tables: {num_top_tables}</h2>
            <h2>Size of Top Tables: {size_top_tables}</h2>
            <h2>Number of Normal Tables: {num_normal_tables}</h2>
            <h2>Size of Normal Tables: {size_normal_tables}</h2>
            <h2>Guests:</h2>
          </div>
        </GridItem>

        <GridItem bg="green.500">
          <GuestTable title="Guest List" names={guestNames} />
        </GridItem>
      </Grid>
    </>
  );
};

export default PlanBuilder;
