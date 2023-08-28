import React from 'react';
import { Box, Button, FormControl, FormLabel, Input } from '@chakra-ui/react';
import { useNavigate } from 'react-router-dom';

export const Register = () => {
const navigate = useNavigate();

const handleRegister = () => {
    navigate('/main');
}

    console.log("Register.tsx");
  return (
    <Box p={8}>
      <FormControl id="Party Name">
        <FormLabel>Party Name</FormLabel>
        <Input type="Party Name" />
      </FormControl>

      <Button mt={8} onClick={handleRegister}>Register</Button>
    </Box>
  );
};

