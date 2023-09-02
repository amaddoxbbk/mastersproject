import React, { useState } from "react";
import { List, ListItem, Box } from "@chakra-ui/react";
import { AddGuestButton } from "./components/AddGuestButton";
import { useEvent } from "./components/EventContext";

export const MainPage = () => {
  const { eventData } = useEvent();
  const [list, setList] = useState<string[]>([]);

  const addGuestToList = (name: string) => {
    setList([...list, name]);
  };

  return (
    <Box p={8}>
      <h1>Welcome to {eventData.event_name}</h1>
      <h2>Event ID: {eventData.event_id}</h2>
      <AddGuestButton addGuestToList={addGuestToList} />
      <List mt={4}>
        {list.map((item, index) => (
          <ListItem key={index}>{item}</ListItem>
        ))}
      </List>
    </Box>
  );
};
