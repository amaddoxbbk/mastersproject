import React, { useState } from 'react';
import { Box, Button, FormControl, FormLabel, Input } from '@chakra-ui/react';
import { useNavigate } from 'react-router-dom';
import { ReusableModal } from './components/ReusableModal'; // Import ReusableModal

export const Register = () => {
  const navigate = useNavigate();

  // State variables for modals and party names
  const [isOpen1, setIsOpen1] = useState(false);
  const [partyName1, setPartyName1] = useState('');
  const [isOpen2, setIsOpen2] = useState(false);
  const [partyName2, setPartyName2] = useState('');

  // Functions to handle party name submissions
  const handlePartyNameSubmit1 = () => {
    // Your logic to handle the first party name
    setIsOpen1(false);
    navigate('/main');
  };

  const handlePartyNameSubmit2 = () => {
    // Your logic to handle the second party name
    setIsOpen2(false);
    navigate('/main');
  };

  return (
    <Box p={8}>
      <Button mt={4} onClick={() => setIsOpen1(true)}>
        Open First Modal to Enter Party Name
      </Button>

      <Button mt={4} ml={4} onClick={() => setIsOpen2(true)}>
        Open Second Modal to Enter Party Name
      </Button>

      {/* Use ReusableModal for the first button */}
      <ReusableModal
        isOpen={isOpen1}
        onClose={() => setIsOpen1(false)}
        title="Enter First Party Name"
        handleSubmit={handlePartyNameSubmit1}
      >
        <FormControl>
          <FormLabel>Party Name</FormLabel>
          <Input value={partyName1} onChange={(e) => setPartyName1(e.target.value)} />
        </FormControl>
      </ReusableModal>

      {/* Use ReusableModal for the second button */}
      <ReusableModal
        isOpen={isOpen2}
        onClose={() => setIsOpen2(false)}
        title="Enter Second Party Name"
        handleSubmit={handlePartyNameSubmit2}
      >
        <FormControl>
          <FormLabel>Party Name</FormLabel>
          <Input value={partyName2} onChange={(e) => setPartyName2(e.target.value)} />
        </FormControl>
      </ReusableModal>
    </Box>
  );
};
