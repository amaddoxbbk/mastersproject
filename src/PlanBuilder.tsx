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
  Box,
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
import PlanBuilderNavBar from "./components/PlanBuilderNavBar";
import TopTableManager from "./components/TopTableManager";

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
  const manuallySelectedTopTableNames = [""];
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
  const numTopTableNumber = parseInt(num_top_tables, 10);

  const topTableSchema = z.object({
    topTableGuests: z.array(z.string()).max(sizeTopTableNumber),
  });

  const tableData = createTableData(
    filteredGuests,
    sizeNormalTablesNumber,
    sizeTopTableNumber,
    topTableGuests,
    numTopTableNumber
  );

  const onTopTableChange = (newTopTableGuests: string[]) => {
    setTopTableGuests(newTopTableGuests);
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
          <PlanBuilderNavBar setShouldRefetch={setShouldRefetch} />
        </GridItem>
        <GridItem area="aside" mt={4}>
          <Box display="flex" justifyContent="center" alignItems="center">
            {num_top_tables > 0 && (
              <TopTableManager
                initialGuests={filteredGuests}
                sizeTopTableNumber={sizeTopTableNumber}
                onTopTableChange={onTopTableChange}
              />
            )}
          </Box>
        </GridItem>
        <GridItem area="main">
          <TableGrid tables={tableData} />
        </GridItem>
      </Grid>
    </>
  );
};

export default PlanBuilder;
