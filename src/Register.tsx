import React, { useState, useEffect } from "react";
import { Box, VStack } from "@chakra-ui/react";
import { useNavigate } from "react-router-dom";
import WriteData from "./components/WriteData";
import { CreateNewEventButton } from "./components/CreateNewEventButton";
import { FindExistingEventButton } from "./components/FindExistingEventButton";
import { useEvent } from "./components/EventContext";
import { RemoveExistingEventButton } from "./components/RemoveExistingEventButton";

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
  const { eventData, setEventData } = useEvent();
  const [shouldRefetch, setShouldRefetch] = useState(false);


  useEffect(() => {
    console.log("Updated event context:", eventData);
  }, [eventData]);


  const handleNewEventSubmit = (
    name: string,
    date: string,
    location: string,
    numTopTables: number,
    maxSizeTopTable: number,
    numNormalTables: number,
    maxSizeNormalTable: number
  ) => {
        const existingEventNames = eventOptions.map((option) => option.label);

        if (existingEventNames.includes(name)) {
          console.error("An event with this name already exists.");
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
      setEventData({
        event_name: selectedEvent.label,
        event_id: parseInt(selectedEvent.value),
      });

      console.log("Selected event data:", selectedEvent);
      console.log("Updated event context:", {
        event_name: selectedEvent.label,
        event_id: parseInt(selectedEvent.value),
      });
      navigate("/main");
    } else {
      console.error("No matching event found for the given query.");
    }
  };

  useEffect(() => {
    const fetchEvents = () => {
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
    };
  
    fetchEvents();
  
    if (shouldRefetch) {
      fetchEvents(); 
      setShouldRefetch(false);
    }
  }, [shouldRefetch]);
  

  return (
    <Box p={6}>
    <VStack spacing={2} mx="auto">
      <CreateNewEventButton
        handleNewEventSubmit={handleNewEventSubmit}
        eventOptions={eventOptions}
        style={{ width: '200px' }}
      />
      <FindExistingEventButton
        handleFindEventSubmit={handleFindEventSubmit}
        eventOptions={eventOptions}
        style={{ width: '200px' }}
      />
      <RemoveExistingEventButton
        eventOptions={eventOptions}
        setShouldRefetch={setShouldRefetch}
        style={{ width: '200px' }}
      />
    </VStack> 

      {shouldWriteData && (
        <WriteData
          endpoint="/api/addEvent"
          payload={{
            event_name: eventName,
            event_date: eventDate,
            event_location: eventLocation,
            numTopTables: numTopTables,
            maxSizeTopTable: maxSizeTopTable,
            numNormalTables: numNormalTables,
            maxSizeNormalTable: maxSizeNormalTable,
          }}
          onSuccess={(data) => {
            console.log("Event added successfully", data);
            setEventData({
              event_name: eventName,
              event_id: data.event_id,
            });
            console.log("Event Name:", eventData.event_name);
console.log("Event ID:", eventData.event_id);

            setShouldWriteData(false);
            navigate("/main");
          }}
          
          onFailure={(error) => {
            console.error("There was an error adding the event", error);
            setShouldWriteData(false); 
          }}
        />
      )}
    </Box>
  );
};
