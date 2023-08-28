import React, { useState } from 'react';
import { Box, Button, FormControl, FormLabel, Input } from '@chakra-ui/react';
import { useNavigate } from 'react-router-dom';
import { ReusableModal } from './components/ReusableModal'; // Import ReusableModal

export const Register = () => {
  const navigate = useNavigate();

  // State variables for modal and party name
  const [isOpen, setIsOpen] = useState(false);
  const [partyName, setPartyName] = useState('');

  // Function to handle party name submission
  const handlePartyNameSubmit = () => {
    // Your logic to handle the party name, maybe save it to database
    setIsOpen(false); // Close the modal
    navigate('/main'); // Navigate to main page
  };

  return (
    <Box p={8}>

      <Button mt={4} onClick={() => setIsOpen(true)}>
        Open Modal to Enter Party Name
      </Button>

      {/* Use ReusableModal here */}
      <ReusableModal
        isOpen={isOpen}
        onClose={() => setIsOpen(false)}
        title="Enter Party Name"
        handleSubmit={handlePartyNameSubmit}
      >
        <FormControl>
          <FormLabel>Party Name</FormLabel>
          <Input value={partyName} onChange={(e) => setPartyName(e.target.value)} />
        </FormControl>
      </ReusableModal>
    </Box>
  );
};
