import React, { useState, useEffect } from "react";
import { Box } from "@chakra-ui/react";
import { useNavigate } from "react-router-dom";
import WriteData from "./components/WriteData";
import { CreateNewEventButton } from "./components/CreateNewEventButton";
import { FindExistingEventButton } from "./components/FindExistingEventButton";

export const Register = () => {
  const navigate = useNavigate();
  const [shouldWriteData, setShouldWriteData] = useState(false);
  const [eventName, setEventName] = useState("");
  const [eventDate, setEventDate] = useState("");
  const [eventLocation, setEventLocation] = useState("");
  const [numTopTables, setNumTopTables] = useState(0);
  const [maxSizeTopTable, setMaxSizeTopTable] = useState(0);
  const [numNormalTables, setNumNormalTables] = useState(0);
  const [maxSizeNormalTable, setMaxSizeNormalTable] = useState(0);
  const [eventOptions, setEventOptions] = useState<{ value: string; label: string }[]>([]);

  const handleNewEventSubmit = (
    name: string,
    date: string,
    location: string,
    numTopTables: number,
    maxSizeTopTable: number,
    numNormalTables: number,
    maxSizeNormalTable: number
  ) => {
    setEventName(name);
    setEventDate(date);
    setEventLocation(location);
    setNumTopTables(numTopTables);
    setMaxSizeTopTable(maxSizeTopTable);
    setNumNormalTables(numNormalTables);
    setMaxSizeNormalTable(maxSizeNormalTable);
    setShouldWriteData(true);
  };

  const handleFindEventSubmit = (searchQuery: string) => {
    // Logic for finding an event by searchQuery
    console.log("Finding event: ", searchQuery);
  };

  useEffect(() => {
    fetch('/api/getEvents')
      .then(response => response.json())
      .then((data: any[]) => {
        const fetchedEventOptions = data.map(event => ({ value: event.id, label: event.event_name }));
        setEventOptions(fetchedEventOptions);
      })
      .catch(error => {
        console.error("There was an error fetching the event names: ", error);
      });
  }, []);

  return (
    <Box p={8}>
      <CreateNewEventButton handleNewEventSubmit={handleNewEventSubmit} />
      <FindExistingEventButton handleFindEventSubmit={handleFindEventSubmit} eventOptions={eventOptions} />
      
      {shouldWriteData && (
        <WriteData
          endpoint="/api/addEvent" // Your API endpoint for adding a new event
          payload={{
            event_name: eventName,
            event_date: eventDate,
            event_location: eventLocation,
            numTopTables: numTopTables,
            maxSizeTopTable: maxSizeTopTable,
            numNormalTables: numNormalTables,
            maxSizeNormalTable: maxSizeNormalTable,
          }}
          onSuccess={() => {
            console.log("Event added successfully");
            setShouldWriteData(false); // Reset the trigger
            navigate("/main"); // Navigate to the main page
          }}
          onFailure={(error) => {
            console.error("There was an error adding the event", error);
            setShouldWriteData(false); // Reset the trigger
          }}
        />
      )}
    </Box>
  );
};
