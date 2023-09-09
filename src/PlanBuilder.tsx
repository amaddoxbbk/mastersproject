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
  Table,
  Show,
} from "@chakra-ui/react";
import { useNavigate } from "react-router-dom";
import { EditExistingEventButton } from "./components/EditExistingEventButton";
import "font-awesome/css/font-awesome.min.css";
import TableGrid from "./components/TableGrid";

interface TableData {
  title: string;
  names: string[];
}

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

  const tableData: TableData[] = [
    {
      title: "Table 1",
      names: ["Alice Johnson", "Bob Smith", "Charlie Brown", "Diego Martinez", "Elena Rodriguez", "Fatima Khan", "Grace Lee", "Hiroshi Tanaka"],
    },
    {
      title: "Table 2",
      names: ["Isabella Garcia", "Jaden Williams", "Kavita Patel", "Liam O'Brien", "Ming Zhao", "Nadia Ali", "Oscar Diaz", "Priya Nair"],
    },
    {
      title: "Table 3",
      names: ["Quincy Adams", "Raj Koothrappali", "Samantha Kim", "Tariq Hussein", "Ursula Le Guin", "Viktor Ivanov", "Wendy Wu", "Xiaoming Li"],
    },
    {
      title: "Table 4",
      names: ["Yasmin Al-Sayyid", "Zachary Taylor", "Aiden Zhang", "Bianca Duarte", "Caleb Johnson", "Dalia Mahmoud", "Elijah Thomas", "Fiona MacLeod"],
    },
    {
      title: "Table 5",
      names: ["Gloria Ng", "Hassan El-Amin", "Ivy O'Connell", "Jasmine Turner", "Khalid Bin Walid", "Linda McCartney", "Mohammed Al-Fayed", "Nina Simone"],
    },
  ];
  

  return (
    <>
      <Grid
        templateAreas={{
          base: `"nav " 
        "aside"
        "main"`,
          lg: `"nav nav" "aside main"`,
        }}
        templateColumns={{
          base: "1fr",
          lg: "225px 1fr",
        }}
      >
        <GridItem area="nav">
          <HStack mt={6} mb={2} ml={2} width="100%" justifyContent="space-between">
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
              <EditExistingEventButton />
              <Button onClick={() => navigate("/main")}>
                Go Back To List
              </Button>
            </HStack>
          </HStack>
        </GridItem>

        <GridItem area="aside" bg="red.500" mt={4}>
          <div>
            <h2>Event ID: {eventData.event_id}</h2>
            <h2>Number of Top Tables: {num_top_tables}</h2>
            <h2>Size of Top Tables: {size_top_tables}</h2>
            <h2>Number of Normal Tables: {num_normal_tables}</h2>
            <h2>Size of Normal Tables: {size_normal_tables}</h2>
            <h2>Guests:</h2>
          </div>
        </GridItem>

        <GridItem area="main">
          <TableGrid tables={tableData} />
        </GridItem>
      </Grid>
    </>
  );
};

export default PlanBuilder;
