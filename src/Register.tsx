import React, { useState } from 'react';
import { Box, Button, FormControl, FormLabel, Input } from '@chakra-ui/react';
import { useNavigate } from 'react-router-dom';
import { ReusableModal } from './components/ReusableModal'; 

export const Register = () => {
  const navigate = useNavigate();

  // State variables for modals and event details
  const [isOpenNew, setIsOpenNew] = useState(false);
  const [eventName, setEventName] = useState('');
  const [eventDate, setEventDate] = useState('');
  const [eventLocation, setEventLocation] = useState('');

  // State variables for finding an existing event
  const [isOpenFind, setIsOpenFind] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  // Function to handle new event submission
  const handleNewEventSubmit = () => {
    // Logic to handle the new event details
    setIsOpenNew(false);
    navigate('/main');
  };

  // Function to handle finding an existing event
  const handleFindEventSubmit = () => {
    // Logic to handle the search query for finding an event
    setIsOpenFind(false);
    navigate('/main');
  };

  // Define the form for adding a new event
  const newEventForm = (
    <>
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

  // Define the form for finding an existing event
  const findEventForm = (
    <FormControl>
      <FormLabel>Search for Event</FormLabel>
      <Input value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} />
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
    </Box>
  );
};
