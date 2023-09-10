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

  const numTopTablesNumber = parseInt(num_top_tables, 10);
const sizeTopTablesNumber = parseInt(size_top_tables, 10);
const numNormalTablesNumber = parseInt(num_normal_tables, 10);
const sizeNormalTablesNumber = parseInt(size_normal_tables, 10);


  // Create tableData based on the fetched guests
  const createTableData = () => {
    let tables = [];
    let currentTable: string[] = [];
    let currentTableIndex = 1;

    console.log("Size of normal tables:", size_normal_tables); // Debugging line
    console.log("Type of size_normal_tables:", typeof size_normal_tables);
    console.log("Guests:", guests); // Debugging line

    guests.forEach((guest, index) => {
      currentTable.push(guest.attendee_name);
      if (currentTable.length === sizeNormalTablesNumber) {
        tables.push({
          title: `Table ${currentTableIndex}`,
          names: [...currentTable],
        });
        currentTable = [];
        currentTableIndex++;
      }
    });

    if (currentTable.length > 0) {
      tables.push({
        title: `Table ${currentTableIndex}`,
        names: [...currentTable],
      });
    }

    return tables;
  };

  const tableData = createTableData();

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

        <GridItem area="aside" mt={4}>
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
