import React, { useState } from 'react';
import { Button, FormControl, FormLabel, Input } from '@chakra-ui/react';
import { ReusableModal } from './ReusableModal';

interface CreateNewEventButtonProps {
    handleNewEventSubmit: (eventName: string, eventDate: string, eventLocation: string) => void;
  }

  export const CreateNewEventButton: React.FC<CreateNewEventButtonProps> = ({ handleNewEventSubmit }) => {
    const [isOpenNew, setIsOpenNew] = useState(false);
  const [eventName, setEventName] = useState("");
  const [eventDate, setEventDate] = useState("");
  const [eventLocation, setEventLocation] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

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

  return (
    <>
      <Button mt={4} onClick={() => setIsOpenNew(true)}>
        Create New Event
      </Button>
      <ReusableModal
        isOpen={isOpenNew}
        onClose={() => setIsOpenNew(false)}
        title="Create New Event"
        handleSubmit={() => handleNewEventSubmit(eventName, eventDate, eventLocation)}
      >
        {newEventForm}
      </ReusableModal>
    </>
  );
};
