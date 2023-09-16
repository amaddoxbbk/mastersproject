// src/components/PlanBuilderNavBar/PlanBuilderNavBar.tsx

import React, { Dispatch, SetStateAction } from 'react';
import { HStack, Button, Text } from '@chakra-ui/react';
import { useNavigate } from 'react-router-dom';
import { useEvent } from './EventContext'; // Adjust the import based on your folder structure
import { EditExistingEventButton } from './EditExistingEventButton'; // Adjust the import based on your folder structure
import { Show } from '@chakra-ui/react';

interface PlanBuilderNavBarProps {
  setShouldRefetch: Dispatch<SetStateAction<boolean>>; // Correctly typed now
}

const PlanBuilderNavBar: React.FC<PlanBuilderNavBarProps> = ({ setShouldRefetch }) => {
  const { eventData } = useEvent();
  const navigate = useNavigate();

  return (
    <HStack
      mt={6}
      mb={2}
      ml={2}
      width="100%"
      justifyContent="space-between"
    >
      <HStack spacing={3}>
        <Button onClick={() => navigate('/home')}>
          <i className="fa fa-home" style={{ fontSize: '30px' }}></i>
        </Button>
        <Show above="lg">
          <Text fontSize="2xl" fontWeight="bold" color="black">
            Welcome to {eventData.event_name}
          </Text>
        </Show>
      </HStack>
      <HStack spacing={3} mr={6}>
        <EditExistingEventButton setShouldRefetch={setShouldRefetch} />
        <Button onClick={() => navigate('/main')}>Go Back To List</Button>
      </HStack>
    </HStack>
  );
};

export default PlanBuilderNavBar;
