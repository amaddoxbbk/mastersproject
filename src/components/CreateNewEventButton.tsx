import React, { useState } from "react";
import { Button, FormControl, FormLabel, Input } from "@chakra-ui/react";
import { ReusableModal } from "./ReusableModal";
import { z } from "zod";
import { Stack } from "@chakra-ui/react";

// Define Zod schema
const newEventSchema = z
  .object({
    eventName: z.string().min(3, "Full event name is required"),
    eventDate: z
      .string()
      .min(1, "Event date is required")
      .refine((date) => {
        const today = new Date();
        const [day, month, year] = date.split("/");
        const eventDate = new Date(`${year}-${month}-${day}`);
        return eventDate > today;
      }, "Event date must be in the future"),
    eventLocation: z
      .string()
      .min(1, "Event location is required")
      .max(100, "Event location name is too long"),
    numTopTables: z
      .number()
      .min(0, "Negative number inputs not valid")
      .max(1, "You cannot have more than one top table"),
    maxSizeTopTable: z
      .number()
      .min(1, "Max size of top table must be greater than zero"),
    numNormalTables: z.number().min(0, "Negative number inputs not valid"),
    maxSizeNormalTable: z
      .number()
      .min(1, "Max size of normal table must be greater than zero"),
  })
  .refine(
    (data) => {
      if (data.numTopTables === 0) {
        return data.maxSizeTopTable === 0;
      }
      return true;
    },
    {
      message:
        "You have entered a top table size with no top table. Please set table size to zero or add a top table",
      path: ["numTopTables", "maxSizeTopTable"],
    }
  );

interface CreateNewEventButtonProps {
  handleNewEventSubmit: (
    eventName: string,
    eventDate: string,
    eventLocation: string,
    numTopTables: number,
    maxSizeTopTable: number,
    numNormalTables: number,
    maxSizeNormalTable: number
  ) => void;
  eventOptions: { value: string; label: string }[];
}

export const CreateNewEventButton: React.FC<CreateNewEventButtonProps> = ({
  handleNewEventSubmit,
  eventOptions,
}) => {
  const [isOpenNew, setIsOpenNew] = useState(false);
  const [eventName, setEventName] = useState("");
  const [eventDate, setEventDate] = useState("");
  const [eventLocation, setEventLocation] = useState("");
  const [numTopTables, setNumTopTables] = useState(0);
  const [maxSizeTopTable, setMaxSizeTopTable] = useState(0);
  const [numNormalTables, setNumNormalTables] = useState(0);
  const [maxSizeNormalTable, setMaxSizeNormalTable] = useState(0);
  const [fieldErrors, setFieldErrors] = useState<{ [key: string]: string }>({});

  const handleSubmit = () => {
    const parsedData = newEventSchema.safeParse({
      eventName,
      eventDate,
      eventLocation,
      numTopTables,
      maxSizeTopTable,
      numNormalTables,
      maxSizeNormalTable,
    });

    if (!parsedData.success) {
      const errors: { [key: string]: string } = {};
      parsedData.error.issues.forEach((issue) => {
        errors[issue.path[0]] = issue.message;
      });
      setFieldErrors(errors);
      return;
    }

    if (eventOptions.some((option) => option.label === eventName)) {
      setFieldErrors({ eventName: "An event with this name already exists." });
      return;
    }

    handleNewEventSubmit(
      eventName,
      eventDate,
      eventLocation,
      numTopTables,
      maxSizeTopTable,
      numNormalTables,
      maxSizeNormalTable
    );
    setIsOpenNew(false);
    setFieldErrors({});
  };

  const newEventForm = (
    <Stack spacing={6}>
      <FormControl>
        {fieldErrors.eventName && (
          <div style={{ color: "red" }}>{fieldErrors.eventName}</div>
        )}
        <FormLabel mb={1}>Event Name</FormLabel>
        <Input
          value={eventName}
          onChange={(e) => setEventName(e.target.value)}
        />
      </FormControl>
      <FormControl>
        {fieldErrors.eventDate && (
          <div style={{ color: "red" }}>{fieldErrors.eventDate}</div>
        )}
        <FormLabel mb={1}>Event Date</FormLabel>
        <Input
          type="date"
          value={eventDate}
          onChange={(e) => setEventDate(e.target.value)}
        />
      </FormControl>
      <FormControl>
        {fieldErrors.eventLocation && (
          <div style={{ color: "red" }}>{fieldErrors.eventLocation}</div>
        )}
        <FormLabel mb={1}>Event Location</FormLabel>
        <Input
          value={eventLocation}
          onChange={(e) => setEventLocation(e.target.value)}
        />
      </FormControl>
      <FormControl>
        {fieldErrors.numTopTables && (
          <div style={{ color: "red" }}>{fieldErrors.numTopTables}</div>
        )}
        <FormLabel mb={1}>Number of Top Tables</FormLabel>
        <Input
          type="number"
          value={numTopTables}
          onChange={(e) => setNumTopTables(parseInt(e.target.value))}
        />
      </FormControl>
      <FormControl>
        {fieldErrors.maxSizeTopTable && (
          <div style={{ color: "red" }}>{fieldErrors.maxSizeTopTable}</div>
        )}
        <FormLabel mb={1}>Max Size of Top Table</FormLabel>
        <Input
          type="number"
          value={maxSizeTopTable}
          onChange={(e) => setMaxSizeTopTable(parseInt(e.target.value))}
        />
      </FormControl>
      <FormControl>
        {fieldErrors.numNormalTables && (
          <div style={{ color: "red" }}>{fieldErrors.numNormalTables}</div>
        )}
        <FormLabel mb={1}>Number of Normal Tables</FormLabel>
        <Input
          type="number"
          value={numNormalTables}
          onChange={(e) => setNumNormalTables(parseInt(e.target.value))}
        />
      </FormControl>
      <FormControl>
        {fieldErrors.maxSizeNormalTable && (
          <div style={{ color: "red" }}>{fieldErrors.maxSizeNormalTable}</div>
        )}
        <FormLabel mb={1}>Max Size of Normal Table</FormLabel>
        <Input
          type="number"
          value={maxSizeNormalTable}
          onChange={(e) => setMaxSizeNormalTable(parseInt(e.target.value))}
        />
      </FormControl>
    </Stack>
  );

  return (
    <>
      <Button mt={4} onClick={() => setIsOpenNew(true)}>
        Create New Event
      </Button>
      <ReusableModal
        isOpen={isOpenNew}
        onClose={() => setIsOpenNew(false)}
        title="Create New Event"
        handleSubmit={handleSubmit}
      >
        {newEventForm}
      </ReusableModal>
    </>
  );
};
