import React, { useState } from 'react';
import { Button, FormControl, FormLabel } from '@chakra-ui/react';
import { ReusableModal } from './ReusableModal';
import GenericDropdown from './GenericDropdown';

interface FindExistingEventButtonProps {
    handleFindEventSubmit: (searchQuery: string) => void;
    eventOptions: { value: string; label: string }[];
  }

  export const FindExistingEventButton: React.FC<FindExistingEventButtonProps> = ({ handleFindEventSubmit, eventOptions }) => {
    const [isOpenFind, setIsOpenFind] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

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
