import React, { useState } from "react";
import { Button, FormControl, FormLabel } from "@chakra-ui/react";
import { ReusableModal } from "./ReusableModal";
import WriteData from "./WriteData";
import { useEvent } from "./EventContext";
import GenericDropdown from "./GenericDropdown";

interface RemoveGuestButtonProps {
  guests: any[];
  setShouldRefetch: React.Dispatch<React.SetStateAction<boolean>>;
}

export const RemoveGuestButton: React.FC<RemoveGuestButtonProps> = ({
  guests,
  setShouldRefetch,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedGuest, setSelectedGuest] = useState("");
  const [shouldWriteData, setShouldWriteData] = useState(false);


  const filteredGuests = guests.filter(
    (guest) => !guest.is_bride && !guest.is_groom
  );

  const options = filteredGuests.map((guest) => ({
    value: guest.attendee_id,
    label: guest.attendee_name,
  }));

  const handleGuestRemove = () => {
    if (!selectedGuest) {
      console.error("No guest selected. Aborting remove.");
      return;
    }

    setShouldWriteData(true);
    setIsOpen(false);
  };

  const onSuccess = () => {
    setSelectedGuest("");
    setShouldWriteData(false);
    setShouldRefetch(true);
  };

  const onFailure = (error: any) => {
    console.error("There was an error removing the guest", error);
    setShouldWriteData(false);
  };

  const form = (
    <>
      <FormControl>
        <FormLabel>Select Guest to Remove</FormLabel>
        <GenericDropdown
          onSelect={(value) => setSelectedGuest(value)}
          selectedValue={selectedGuest}
          options={options}
          title="Select Guest"
        />
      </FormControl>
    </>
  );

  return (
    <>
      <Button onClick={() => setIsOpen(true)}>Remove Guest</Button>
      <ReusableModal
        isOpen={isOpen}
        onClose={() => setIsOpen(false)}
        title="Remove Guest"
        handleSubmit={handleGuestRemove}
      >
        {form}
      </ReusableModal>
      {shouldWriteData && (
        <WriteData
          endpoint="/api/removeGuest"
          payload={{
            attendee_id: selectedGuest,
          }}
          onSuccess={onSuccess}
          onFailure={onFailure}
        />
      )}
    </>
  );
};
