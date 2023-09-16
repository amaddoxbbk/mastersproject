import React, { useState, useEffect } from "react";
import { Button, FormControl, FormErrorMessage, FormLabel, Input, Stack } from "@chakra-ui/react";
import { ReusableModal } from "./ReusableModal";
import { z } from "zod";
import WriteData from "./WriteData"; // Import WriteData
import { useEvent } from "./EventContext"; // Import the context
import axios from "axios";

const tableSchema = z.object({
  numTopTables: z.number().min(0, "Negative number inputs not valid").max(1, "Only one top table allowed"),
  maxSizeTopTable: z.number().min(0, "Negative number inputs not valid"),
  numNormalTables: z.number().min(0, "Negative number inputs not valid"),
  maxSizeNormalTable: z.number().min(0, "Negative number inputs not valid"),
});

interface EditExistingEventButtonProps {
  setShouldRefetch: React.Dispatch<React.SetStateAction<boolean>>;
}

export const EditExistingEventButton: React.FC<EditExistingEventButtonProps> = ({ setShouldRefetch }) => {
  const { eventData } = useEvent(); // Use the context
  const [isOpenEdit, setIsOpenEdit] = useState(false);
  const [numTopTables, setNumTopTables] = useState(0);
  const [maxSizeTopTable, setMaxSizeTopTable] = useState(0);
  const [numNormalTables, setNumNormalTables] = useState(0);
  const [maxSizeNormalTable, setMaxSizeNormalTable] = useState(0);
  const [fieldErrors, setFieldErrors] = useState<{ [key: string]: string }>({});
  const [shouldWriteData, setShouldWriteData] = useState(false);
  const [isLoading, setIsLoading] = useState(false); // New state variable for loading status

  const handleSubmit = () => {
    console.log("Submitting edit event form");
    const parsedData = tableSchema.safeParse({
        numTopTables: Number(numTopTables),
        maxSizeTopTable: Number(maxSizeTopTable),
        numNormalTables: Number(numNormalTables),
        maxSizeNormalTable: Number(maxSizeNormalTable),
    });

    console.log(parsedData);

    if (!parsedData.success) {
      const errors: { [key: string]: string } = {};
      parsedData.error.issues.forEach((issue) => {
        errors[issue.path[0]] = issue.message;
      });
      setFieldErrors(errors);
      console.log("Errors in form submission");
      console.log(errors);
      return;
    }

    setShouldWriteData(true);
    setIsOpenEdit(false);
  };

  const onSuccess = () => {
    setShouldWriteData(false);
    setShouldRefetch(true);
    setFieldErrors({});
  };

  const onFailure = (error: any) => {
    console.error("There was an error editing the event", error);
    setShouldWriteData(false);
  };

  useEffect(() => {
    if (isOpenEdit) {
        setIsLoading(true); // Set loading to true when starting to fetch
        const fetchEventData = async () => {
            try {
              const response = await axios.post('/api/getOneEvent', { event_id: eventData.event_id });
              const existingEvent = response.data;
          
              if (existingEvent) {
                setNumTopTables(existingEvent.num_top_tables);
                setMaxSizeTopTable(existingEvent.size_top_tables);
                setNumNormalTables(existingEvent.num_normal_tables);
                setMaxSizeNormalTable(existingEvent.size_normal_tables);
              } else {
                console.error("Event not found");
              }
            } catch (error) {
              console.error("Error fetching existing event data:", error);
            }
            setIsLoading(false); // Set loading to false when done fetching
          };

      fetchEventData();
    }
  }, [isOpenEdit]);

  const editEventForm = (
    <Stack spacing={6}>
      <FormControl isInvalid={fieldErrors['numTopTables'] ? true : false} isDisabled={isLoading}> 
        <FormLabel>Number of Top Tables</FormLabel>
        <Input
          type="number"
          value={numTopTables}
          onChange={(e) => setNumTopTables(parseInt(e.target.value))}
        />
        {fieldErrors['numTopTables'] && <FormErrorMessage>{fieldErrors['numTopTables']}</FormErrorMessage>}
      </FormControl>
      <FormControl isInvalid={fieldErrors['maxSizeTopTable'] ? true : false} isDisabled={isLoading}> 
        <FormLabel>Max Size of Top Table</FormLabel>
        <Input
          type="number"
          value={maxSizeTopTable}
          onChange={(e) => setMaxSizeTopTable(parseInt(e.target.value))}
        />
        {fieldErrors['maxSizeTopTable'] && <FormErrorMessage>{fieldErrors['maxSizeTopTable']}</FormErrorMessage>}
      </FormControl>
      <FormControl isInvalid={fieldErrors['numNormalTables'] ? true : false} isDisabled={isLoading}> 
        <FormLabel>Number of Normal Tables</FormLabel>
        <Input
          type="number"
          value={numNormalTables}
          onChange={(e) => setNumNormalTables(parseInt(e.target.value))}
        />
        {fieldErrors['numNormalTables'] && <FormErrorMessage>{fieldErrors['numNormalTables']}</FormErrorMessage>}
      </FormControl>
      <FormControl isInvalid={fieldErrors['maxSizeNormalTable'] ? true : false} isDisabled={isLoading}> 
        <FormLabel>Max Size of Normal Table</FormLabel>
        <Input
          type="number"
          value={maxSizeNormalTable}
          onChange={(e) => setMaxSizeNormalTable(parseInt(e.target.value))}
        />
        {fieldErrors['maxSizeNormalTable'] && <FormErrorMessage>{fieldErrors['maxSizeNormalTable']}</FormErrorMessage>}
      </FormControl>
    </Stack>
  );
  

  return (
    <>
      <Button onClick={() => setIsOpenEdit(true)}>
        Edit Event
      </Button>
      <ReusableModal
        isOpen={isOpenEdit}
        onClose={() => setIsOpenEdit(false)}
        title="Edit Existing Event"
        handleSubmit={handleSubmit}
      >
        {editEventForm}
      </ReusableModal>
      {shouldWriteData && (
        <WriteData
          endpoint="/api/editEvent"
          payload={{
            event_id: eventData.event_id,
            numTopTables,
            maxSizeTopTable,
            numNormalTables,
            maxSizeNormalTable,
          }}
          onSuccess={onSuccess}
          onFailure={onFailure}
        />
      )}
    </>
  );
};
