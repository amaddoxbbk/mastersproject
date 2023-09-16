import { useEffect, useState } from "react";
import { useEvent } from "./components/EventContext";
import axios from "axios";
import {
  Grid,
  GridItem,
  Box,
} from "@chakra-ui/react";
import "font-awesome/css/font-awesome.min.css";
import TableGrid from "./components/TableGrid";
import { createTableData } from "./utilities/tableUtils";
import PlanBuilderNavBar from "./components/PlanBuilderNavBar";
import TopTableManager from "./components/TopTableManager";

const PlanBuilder = () => {
  const { eventData } = useEvent();
  const [guests, setGuests] = useState<any[]>([]);
  const [eventInfo, setEventInfo] = useState<any>(null);
  const [shouldRefetch, setShouldRefetch] = useState(false);
  const manuallySelectedTopTableNames = [""];
  const filteredGuests = guests.filter(
    (guest) => !manuallySelectedTopTableNames.includes(guest.attendee_name)
  );
  const [topTableGuests, setTopTableGuests] = useState<string[]>([]);

  const fetchData = async () => {
    try {
      const guestsResponse = await axios.post("/api/getGuests", {
        event_id: eventData.event_id,
      });

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
  const numNormalTableNumber = parseInt(num_normal_tables, 10);

  const tableData = createTableData(
    filteredGuests,
    sizeNormalTablesNumber,
    sizeTopTableNumber,
    topTableGuests,
    numTopTableNumber,
    numNormalTableNumber
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
