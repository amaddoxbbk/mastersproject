import React, { useState } from 'react';
import axios from 'axios';
import { Button, FormControl, FormLabel, Text } from '@chakra-ui/react';
import { ReusableModal } from './ReusableModal';
import GenericDropdown from './GenericDropdown';

interface RemoveExistingEventButtonProps {
  eventOptions: { value: string; label: string }[];
  setShouldRefetch: React.Dispatch<React.SetStateAction<boolean>>;
}

export const RemoveExistingEventButton: React.FC<RemoveExistingEventButtonProps> = ({ eventOptions, setShouldRefetch }) => {
  const [isOpenRemove, setIsOpenRemove] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  const handleSubmit = async () => {
    if (!selectedEvent) {
      setErrorMessage("Please select an event to Remove");
      return;
    }

    try {
      // First, remove all guests related to the event
      const removeGuestsResponse = await axios.post('/api/removeAllGuests', {
        event_id: selectedEvent,
      });

      if (removeGuestsResponse.status !== 200) {
        setErrorMessage("An error occurred while deleting the guests.");
        return;
      }

      // Then, remove the event itself
      const response = await axios.post('/api/removeEvent', {
        event_id: selectedEvent,
      });

      if (response.status === 200) {
        setIsOpenRemove(false);
        setShouldRefetch(true); // Trigger a refetch to update the list of events
      }
    } catch (error) {
      console.error("Error deleting event:", error);
      setErrorMessage("An error occurred while deleting the event.");
    }
  };

  const RemoveEventForm = (
    <FormControl>
      <FormLabel>Select Event to Remove</FormLabel>
      <GenericDropdown
        onSelect={(value) => { setSelectedEvent(value); setErrorMessage(""); }}
        selectedValue={selectedEvent}
        options={eventOptions}
        title="Select Event"
      />
      {errorMessage && <Text color="red">{errorMessage}</Text>}
    </FormControl>
  );

  return (
    <>
      <Button mt={4} ml={4} onClick={() => setIsOpenRemove(true)}>
        Remove Existing Event
      </Button>
      <ReusableModal
        isOpen={isOpenRemove}
        onClose={() => { setIsOpenRemove(false); setErrorMessage(""); }}
        title="Remove Existing Event"
        handleSubmit={handleSubmit}
      >
        {RemoveEventForm}
      </ReusableModal>
    </>
  );
};
