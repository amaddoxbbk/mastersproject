import React, { useState } from "react";
import {
  Button,
  FormControl,
  FormLabel,
  Input,
  Checkbox,
} from "@chakra-ui/react";
import { ReusableModal } from "./ReusableModal";
import WriteData from "./WriteData";
import { useEvent } from "./EventContext";

interface AddGuestButtonProps {
  addGuestToList: (name: string) => void;
}

export const AddGuestButton: React.FC<AddGuestButtonProps> = ({
  addGuestToList,
}) => {
  const { eventData } = useEvent();
  const eventId = eventData.event_id;

  const [isOpen, setIsOpen] = useState(false);
  const [name, setName] = useState("");
  const [plusOne, setPlusOne] = useState("");
  const [relationship, setRelationship] = useState("");
  const [blacklist, setBlacklist] = useState("");
  const [specialStatus, setSpecialStatus] = useState("");
  const [isBride, setIsBride] = useState(false);
  const [isGroom, setIsGroom] = useState(false);
  const [shouldWriteData, setShouldWriteData] = useState(false);

  const handleGuestSubmit = () => {
    console.log("Submitting guest with event ID:", eventId); // Debugging line
    if (eventId === undefined) {
      console.error("Event ID is undefined. Aborting submit.");
      return;
    }
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
      <FormControl>
        <FormLabel>Relationship</FormLabel>
        <Input
          value={relationship}
          onChange={(e) => setRelationship(e.target.value)}
        />
      </FormControl>
      <FormControl>
        <FormLabel>Blacklist Attendee IDs</FormLabel>
        <Input
          value={blacklist}
          onChange={(e) => setBlacklist(e.target.value)}
        />
      </FormControl>
      <FormControl>
        <FormLabel>Special Status</FormLabel>
        <Input
          value={specialStatus}
          onChange={(e) => setSpecialStatus(e.target.value)}
        />
      </FormControl>
      <FormControl>
        <Checkbox
          isChecked={isBride}
          onChange={(e) => setIsBride(e.target.checked)}
        >
          Is Bride
        </Checkbox>
      </FormControl>
      <FormControl>
        <Checkbox
          isChecked={isGroom}
          onChange={(e) => setIsGroom(e.target.checked)}
        >
          Is Groom
        </Checkbox>
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
          endpoint="/api/addGuest"
          payload={{
            event_id: eventId,
            attendee_name: name,
            plus_one_name: plusOne,
            relationship,
            blacklist_attendee_ids: blacklist,
            special_status: specialStatus,
            is_bride: isBride,
            is_groom: isGroom,
          }}
          onSuccess={onSuccess}
          onFailure={onFailure}
        />
      )}
    </>
  );
};
