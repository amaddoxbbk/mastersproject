import React, { useState, useEffect } from "react";
import { Box } from "@chakra-ui/react";
import { useNavigate } from "react-router-dom";
import WriteData from "./components/WriteData";
import { CreateNewEventButton } from "./components/CreateNewEventButton";
import { FindExistingEventButton } from "./components/FindExistingEventButton";
import { useEvent } from "./components/EventContext";

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
  const [eventOptions, setEventOptions] = useState<
    { value: string; label: string }[]
  >([]);
  const { setEventData } = useEvent();

  const handleNewEventSubmit = (
    name: string,
    date: string,
    location: string,
    numTopTables: number,
    maxSizeTopTable: number,
    numNormalTables: number,
    maxSizeNormalTable: number
  ) => {
        // Extract the existing event names from eventOptions
        const existingEventNames = eventOptions.map((option) => option.label);

        // Check if event name already exists
        if (existingEventNames.includes(name)) {
          console.error("An event with this name already exists.");
          // Show an error message to the user, can be a state-based UI message
          return;
        }
    
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
    const selectedEvent = eventOptions.find(
      (option) => option.value === searchQuery
    );

    if (selectedEvent) {
      // Update EventContext
      setEventData({
        event_name: selectedEvent.label,
        event_id: parseInt(selectedEvent.value),
      }); // <-- Update this line

      console.log("Selected event data:", selectedEvent);
      console.log("Updated event context:", {
        event_name: selectedEvent.label,
        event_id: parseInt(selectedEvent.value), // <-- Update this line
      });
      navigate("/main"); // Navigate to the main page
    } else {
      // ... (rest of your code)
    }
  };

  useEffect(() => {
    fetch("/api/getEvents")
      .then((response) => response.json())
      .then((data: any[]) => {
        const fetchedEventOptions = data.map((event) => ({
          value: event.event_id.toString(),
          label: event.event_name,
        }));
        setEventOptions(fetchedEventOptions);
      })
      .catch((error) => {
        console.error("There was an error fetching the event names: ", error);
      });
  }, []);

  return (
    <Box p={8}>
      <CreateNewEventButton
        handleNewEventSubmit={handleNewEventSubmit}
        eventOptions={eventOptions}
      />
      <FindExistingEventButton
        handleFindEventSubmit={handleFindEventSubmit}
        eventOptions={eventOptions}
      />

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
