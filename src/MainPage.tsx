import React, { useState } from "react";
import axios from "axios";
import {
  Button,
  FormControl,
  FormLabel,
  Input,
  List,
  ListItem,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
} from "@chakra-ui/react";

export const MainPage = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [name, setName] = useState("");
  const [list, setList] = useState<string[]>([]);

  const onClose = () => setIsOpen(false);

  const handleNameSubmit = async () => {
    setList([...list, name]);
    setName("");
  
    const payload = {
      attendee: name,
      plus_one: 'John', // Replace this with your logic
    };
  
    try {
        const res = await axios.post('/api/addUser', payload);
  
      if (res.status === 200) {
        console.log("Attendee added");
      }
    } catch (error) {
      console.error("There was an error adding the attendee", error);
    }
    onClose();
  };

  return (
    <>
      <Button onClick={() => setIsOpen(true)}>Add Name</Button>
      <List mt={4}>
        {list.map((item, index) => (
          <ListItem key={index}>{item}</ListItem>
        ))}
      </List>

      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Form to add a new name</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <FormControl>
              <FormLabel>Name</FormLabel>
              <Input value={name} onChange={(e) => setName(e.target.value)} />
            </FormControl>
          </ModalBody>
          <ModalFooter>
            <Button onClick={handleNameSubmit}>Submit</Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
};

