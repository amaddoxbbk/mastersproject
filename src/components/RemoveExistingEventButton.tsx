import React, { useState } from "react";
import axios from "axios";
import { Button, FormControl, FormLabel, Input, Text } from "@chakra-ui/react";
import { ReusableModal } from "./ReusableModal";
import GenericDropdown from "./GenericDropdown";

interface RemoveExistingEventButtonProps {
  eventOptions: { value: string; label: string }[];
  setShouldRefetch: React.Dispatch<React.SetStateAction<boolean>>;
  style?: React.CSSProperties;
}

export const RemoveExistingEventButton: React.FC<
  RemoveExistingEventButtonProps
> = ({ eventOptions, setShouldRefetch, style }) => {
  const [isOpenRemove, setIsOpenRemove] = useState(false);
  const [confirmRemove, setConfirmRemove] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [confirmText, setConfirmText] = useState("");

  const handleSubmit = () => {
    if (!selectedEvent) {
      setErrorMessage("Please select an event to Remove");
      return;
    }

    setConfirmRemove(true);
  };

  const onConfirmRemove = async () => {
    if (confirmText !== "DELETE") {
      setErrorMessage("Please type DELETE to confirm.");
      return;
    }
    try {
      // First, remove all guests related to the event
      const removeGuestsResponse = await axios.post("/api/removeAllGuests", {
        event_id: selectedEvent,
      });

      if (removeGuestsResponse.status !== 200) {
        setErrorMessage("An error occurred while deleting the guests.");
        return;
      }

      // Then, remove the event itself
      const response = await axios.post("/api/removeEvent", {
        event_id: selectedEvent,
      });

      if (response.status === 200) {
        setIsOpenRemove(false);
        setShouldRefetch(true);
        setConfirmRemove(false);
        setErrorMessage("");
        setConfirmText("");
      }
    } catch (error) {
      console.error("Error deleting event:", error);
      setErrorMessage("An error occurred while deleting the event.");
      setConfirmRemove(false); 
    }
  };

  const RemoveEventForm = (
    <FormControl>
      <FormLabel>Select Event to Remove</FormLabel>
      <GenericDropdown
        onSelect={(value) => {
          setSelectedEvent(value);
          setErrorMessage("");
        }}
        selectedValue={selectedEvent}
        options={eventOptions}
        title="Select Event"
      />
      {errorMessage && <Text color="red">{errorMessage}</Text>}
    </FormControl>
  );

  return (
    <>
      <Button mt={4} ml={4} onClick={() => setIsOpenRemove(true)} style={style}>
        Remove Existing Event
      </Button>
      <ReusableModal
        isOpen={isOpenRemove}
        onClose={() => {
          setIsOpenRemove(false);
          setErrorMessage("");
        }}
        title="Remove Existing Event"
        handleSubmit={handleSubmit}
      >
        {RemoveEventForm}
      </ReusableModal>
      <ReusableModal
        isOpen={confirmRemove}
        onClose={() => {
          setConfirmRemove(false);
          setConfirmText("");
        }}
        title="Confirm Remove"
        handleSubmit={onConfirmRemove}
      >
        <Text color="red" fontWeight="bold">
          WARNING: This will delete the event and all associated guests.
        </Text>
        <Text mt={4}>
          Type "DELETE" to confirm:
          <Input
            mt={4}
            value={confirmText}
            onChange={(e) => setConfirmText(e.target.value)}
          />
        </Text>
        {errorMessage && <Text color="red">{errorMessage}</Text>}
      </ReusableModal>
    </>
  );
};
