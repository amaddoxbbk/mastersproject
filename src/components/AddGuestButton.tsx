import React, { useState } from 'react';
import { Button, FormControl, FormLabel, Input } from '@chakra-ui/react';
import { ReusableModal } from './ReusableModal';
import WriteData from './WriteData';

interface AddGuestButtonProps {
  addGuestToList: (name: string) => void;
}

export const AddGuestButton: React.FC<AddGuestButtonProps> = ({ addGuestToList }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [name, setName] = useState("");
  const [plusOne, setPlusOne] = useState("");
  const [shouldWriteData, setShouldWriteData] = useState(false);

  const handleGuestSubmit = () => {
    setShouldWriteData(true);
    setIsOpen(false);
  };

  const onSuccess = () => {
    addGuestToList(name);
    setName("");
    setPlusOne("");
    setShouldWriteData(false);
  };

  const onFailure = (error: any) => {
    console.error("There was an error adding the guest", error);
    setShouldWriteData(false);
  };

  const form = (
    <>
      <FormControl>
        <FormLabel>Guest Name</FormLabel>
        <Input value={name} onChange={(e) => setName(e.target.value)} />
      </FormControl>
      <FormControl>
        <FormLabel>Plus One</FormLabel>
        <Input value={plusOne} onChange={(e) => setPlusOne(e.target.value)} />
      </FormControl>
    </>
  );

  return (
    <>
      <Button onClick={() => setIsOpen(true)}>Add Guest</Button>
      <ReusableModal
        isOpen={isOpen}
        onClose={() => setIsOpen(false)}
        title="New Guest"
        handleSubmit={handleGuestSubmit}
      >
        {form}
      </ReusableModal>
      {shouldWriteData && (
        <WriteData
          endpoint="/api/addUser"
          payload={{ attendee: name, plus_one: plusOne }}
          onSuccess={onSuccess}
          onFailure={onFailure}
        />
      )}
    </>
  );
};
