import React, { useState } from "react";
import { List, ListItem, Box } from "@chakra-ui/react";
import { AddGuestButton } from "./components/AddGuestButton";
import { useEvent } from "./components/EventContext";

export const MainPage = () => {
  const { eventData } = useEvent();
  const eventName = eventData.event_name || "Unknown Event";
  const [list, setList] = useState<string[]>([]);

  const addGuestToList = (name: string) => {
    setList([...list, name]);
  };

  return (
    <Box p={8}>
      <h1>Welcome to {eventName}</h1>
      <AddGuestButton addGuestToList={addGuestToList} /> 
      <List mt={4}>
        {list.map((item, index) => (
          <ListItem key={index}>{item}</ListItem>
        ))}
      </List>
    </Box>
  );
};
