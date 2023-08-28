import React, { useState, useEffect } from "react";
import { Box, Button, FormControl, FormLabel, Input } from "@chakra-ui/react";
import { useNavigate } from "react-router-dom";
import { ReusableModal } from "./components/ReusableModal";
import WriteData from "./components/WriteData";
import GenericDropdown from './components/GenericDropdown';

export const Register = () => {

  interface EventOption {
    id: string;
    event_name: string;
  }

  const navigate = useNavigate();
  const [isOpenNew, setIsOpenNew] = useState(false);
  const [eventName, setEventName] = useState("");
  const [eventDate, setEventDate] = useState("");
  const [eventLocation, setEventLocation] = useState("");
  const [isOpenFind, setIsOpenFind] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [shouldWriteData, setShouldWriteData] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [eventOptions, setEventOptions] = useState<{ value: string; label: string; }[]>([]);
  const [isCurrentlySubmitting, setIsCurrentlySubmitting] = useState(false);

  const handleNewEventSubmit = () => {
    if (isCurrentlySubmitting) {
      return;
    }

    if (!eventName || !eventDate || !eventLocation) {
      setErrorMessage("All fields are required");
      return;
    }

    setIsCurrentlySubmitting(true);
    setErrorMessage("");
    setIsOpenNew(false);
    setShouldWriteData(true);
    setIsCurrentlySubmitting(false);
  };

  const handleFindEventSubmit = () => {
    setIsOpenFind(false);
  };

  useEffect(() => {
    fetch('/api/getEvents')
      .then(response => response.json())
      .then((data: EventOption[]) => {
        const fetchedEventOptions = data.map(event => ({ value: event.id, label: event.event_name }));
        setEventOptions(fetchedEventOptions);
      })
      .catch(error => {
        console.error("There was an error fetching the event names: ", error);
      });
  }, []);

  const newEventForm = (
    <>
      {errorMessage && <div style={{ color: "red" }}>{errorMessage}</div>}
      <FormControl>
        <FormLabel>Event Name</FormLabel>
        <Input value={eventName} onChange={(e) => setEventName(e.target.value)} />
      </FormControl>
      <FormControl>
        <FormLabel>Event Date</FormLabel>
        <Input type="date" value={eventDate} onChange={(e) => setEventDate(e.target.value)} />
      </FormControl>
      <FormControl>
        <FormLabel>Event Location</FormLabel>
        <Input value={eventLocation} onChange={(e) => setEventLocation(e.target.value)} />
      </FormControl>
    </>
  );

  const findEventForm = (
    <FormControl>
      <FormLabel>Search for Event</FormLabel>
      <GenericDropdown
        onSelect={(value) => setSearchQuery(value)}
        selectedValue={searchQuery}
        options={eventOptions}
        title="Select Event"
      />
    </FormControl>
  );

  return (
    <Box p={8}>
      <Button mt={4} onClick={() => setIsOpenNew(true)}>
        Create New Event
      </Button>
      <Button mt={4} ml={4} onClick={() => setIsOpenFind(true)}>
        Find Existing Event
      </Button>
      <ReusableModal
        isOpen={isOpenNew}
        onClose={() => setIsOpenNew(false)}
        title="Create New Event"
        handleSubmit={handleNewEventSubmit}
      >
        {newEventForm}
      </ReusableModal>
      <ReusableModal
        isOpen={isOpenFind}
        onClose={() => setIsOpenFind(false)}
        title="Find Existing Event"
        handleSubmit={handleFindEventSubmit}
      >
        {findEventForm}
      </ReusableModal>
      {shouldWriteData && (
        <WriteData
          endpoint="/api/addEvent"
          payload={{
            event_name: eventName,
            event_date: eventDate,
            event_location: eventLocation,
          }}
          onSuccess={() => {
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
