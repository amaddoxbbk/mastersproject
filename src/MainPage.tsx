import React, { useState } from "react";
import {
  Button,
  FormControl,
  FormLabel,
  Input,
  List,
  ListItem,
  Box,
} from "@chakra-ui/react";
import { ReusableModal } from "./components/ReusableModal";
import WriteData from "./components/WriteData";
import { useEvent } from "./components/EventContext"; // Import the context hook

export const MainPage = () => {
  const { eventData } = useEvent(); // Use the context hook to get eventData
  const eventName = eventData.event_name || "Unknown Event"; // Get the event name or default to "Unknown Event"

  const [isOpen, setIsOpen] = useState(false);
  const [name, setName] = useState("");
  const [plusOne, setPlusOne] = useState("");
  const [list, setList] = useState<string[]>([]);
  const [shouldWriteData, setShouldWriteData] = useState(false);

  const onClose = () => setIsOpen(false);

  const handleNameSubmit = () => {
    console.log("Name: ", name);
    setShouldWriteData(true); // Set this flag true to indicate that data should be written
    onClose();
  };

  const onSuccess = () => {
    setList([...list, name]); // Update the list only if the data write is successful
    setName(""); // Clear the name
    setPlusOne(""); // Clear the plus one
    setShouldWriteData(false); // Reset the flag
  };

  const onFailure = (error: any) => {
    console.error("There was an error adding the attendee", error);
    setShouldWriteData(false); // Reset the flag
  };

  const form = (
    <>
      <FormControl>
        <FormLabel>Name</FormLabel>
        <Input value={name} onChange={(e) => setName(e.target.value)} />
      </FormControl>

      <FormControl>
        <FormLabel>Plus One</FormLabel>
        <Input value={plusOne} onChange={(e) => setPlusOne(e.target.value)} />
      </FormControl>
    </>
  );

  return (
    <Box p={8}>
      <h1>Welcome to {eventName}</h1>
      <Button onClick={() => setIsOpen(true)}>Add Name</Button>
      <List mt={4}>
        {list.map((item, index) => (
          <ListItem key={index}>{item}</ListItem>
        ))}
      </List>
      <ReusableModal
        isOpen={isOpen}
        onClose={onClose}
        title="New Attendee"
        handleSubmit={handleNameSubmit}
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
    </Box>
  );
};
