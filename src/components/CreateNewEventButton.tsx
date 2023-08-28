import React, { useState } from 'react';
import { Button, FormControl, FormLabel, Input } from '@chakra-ui/react';
import { ReusableModal } from './ReusableModal';

interface CreateNewEventButtonProps {
  handleNewEventSubmit: (
    eventName: string,
    eventDate: string,
    eventLocation: string,
    numTopTables: number,
    maxSizeTopTable: number,
    numNormalTables: number,
    maxSizeNormalTable: number
  ) => void;
  eventOptions: { value: string; label: string }[]; // Additional prop for the list of existing events
}

export const CreateNewEventButton: React.FC<CreateNewEventButtonProps> = ({ handleNewEventSubmit, eventOptions }) => {
  const [isOpenNew, setIsOpenNew] = useState(false);
  const [eventName, setEventName] = useState("");
  const [eventDate, setEventDate] = useState("");
  const [eventLocation, setEventLocation] = useState("");
  const [numTopTables, setNumTopTables] = useState(0);
  const [maxSizeTopTable, setMaxSizeTopTable] = useState(0);
  const [numNormalTables, setNumNormalTables] = useState(0);
  const [maxSizeNormalTable, setMaxSizeNormalTable] = useState(0);
  const [errorMessage, setErrorMessage] = useState("");

  const handleSubmit = () => {
    if (!eventName || !eventDate || !eventLocation || numTopTables < 0 || maxSizeTopTable < 0 || numNormalTables < 0 || maxSizeNormalTable < 0) {
      setErrorMessage("All fields must be completed.");
      return;
    }
  
    if (eventOptions.some(option => option.label === eventName)) {
      setErrorMessage("An event with this name already exists.");
      return;
    }
  
    handleNewEventSubmit(eventName, eventDate, eventLocation, numTopTables, maxSizeTopTable, numNormalTables, maxSizeNormalTable);
    setIsOpenNew(false);
    setErrorMessage(""); // Clear any existing error messages
  };
  

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
      <FormControl>
        <FormLabel>Number of Top Tables</FormLabel>
        <Input type="number" value={numTopTables} onChange={(e) => setNumTopTables(parseInt(e.target.value))} />
      </FormControl>
      <FormControl>
        <FormLabel>Max Size of Top Table</FormLabel>
        <Input type="number" value={maxSizeTopTable} onChange={(e) => setMaxSizeTopTable(parseInt(e.target.value))} />
      </FormControl>
      <FormControl>
        <FormLabel>Number of Normal Tables</FormLabel>
        <Input type="number" value={numNormalTables} onChange={(e) => setNumNormalTables(parseInt(e.target.value))} />
      </FormControl>
      <FormControl>
        <FormLabel>Max Size of Normal Table</FormLabel>
        <Input type="number" value={maxSizeNormalTable} onChange={(e) => setMaxSizeNormalTable(parseInt(e.target.value))} />
      </FormControl>
    </>
  );

  return (
    <>
      <Button mt={4} onClick={() => setIsOpenNew(true)}>
        Create New Event
      </Button>
      <ReusableModal
        isOpen={isOpenNew}
        onClose={() => setIsOpenNew(false)}
        title="Create New Event"
        handleSubmit={handleSubmit} // Use the new handleSubmit function
      >
        {newEventForm}
      </ReusableModal>
    </>
  );
};
