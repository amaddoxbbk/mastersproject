import React, { useState } from 'react';
import { Button, FormControl, FormLabel } from '@chakra-ui/react';
import { ReusableModal } from './ReusableModal';
import GenericDropdown from './GenericDropdown';

interface FindExistingEventButtonProps {
    handleFindEventSubmit: (searchQuery: string) => void;
    eventOptions: { value: string; label: string }[];
}

export const FindExistingEventButton: React.FC<FindExistingEventButtonProps> = ({ handleFindEventSubmit, eventOptions }) => {
  console.log("FindExistingEventButton rendered");
  console.log("eventOptions: ", eventOptions);

  const [isOpenFind, setIsOpenFind] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  const onSelectDropdown = (value: string) => {
    console.log("Dropdown onSelect called with value: ", value);
    setSearchQuery(value);
  };

  const findEventForm = (
    <FormControl>
      <FormLabel>Search for Event</FormLabel>
      <GenericDropdown
        onSelect={onSelectDropdown}
        selectedValue={searchQuery}
        options={eventOptions}
        title="Select Event"
      />
    </FormControl>
  );

  return (
    <>
      <Button mt={4} ml={4} onClick={() => setIsOpenFind(true)}>
        Find Existing Event
      </Button>
      <ReusableModal
        isOpen={isOpenFind}
        onClose={() => setIsOpenFind(false)}
        title="Find Existing Event"
        handleSubmit={() => handleFindEventSubmit(searchQuery)}
      >
        {findEventForm}
      </ReusableModal>
    </>
  );
};
