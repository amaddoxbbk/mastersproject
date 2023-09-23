import React, { useState } from 'react';
import { Button, FormControl, FormLabel, Text } from '@chakra-ui/react';
import { ReusableModal } from './ReusableModal';
import GenericDropdown from './GenericDropdown';

interface FindExistingEventButtonProps {
  handleFindEventSubmit: (searchQuery: string) => void;
  eventOptions: { value: string; label: string }[];
  style?: React.CSSProperties;
}

export const FindExistingEventButton: React.FC<FindExistingEventButtonProps> = ({ handleFindEventSubmit, eventOptions, style }) => {
  const [isOpenFind, setIsOpenFind] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  const handleSubmit = () => {
    if (!searchQuery) {
      setErrorMessage("Please select an event");
      return;
    }
    handleFindEventSubmit(searchQuery);
  };

  const findEventForm = (
    <FormControl>
      <FormLabel>Search for Event</FormLabel>
      <GenericDropdown
        onSelect={(value) => { setSearchQuery(value); setErrorMessage(""); }}
        selectedValue={searchQuery}
        options={eventOptions}
        title="Select Event"
      />
      {errorMessage && <Text color="red">{errorMessage}</Text>}
    </FormControl>
  );

  return (
    <>
      <Button mt={4} ml={4} onClick={() => setIsOpenFind(true)} style={style}>
        Find Existing Event
      </Button>
      <ReusableModal
        isOpen={isOpenFind}
        onClose={() => { setIsOpenFind(false); setErrorMessage(""); }}
        title="Find Existing Event"
        handleSubmit={handleSubmit}
      >
        {findEventForm}
      </ReusableModal>
    </>
  );
};
