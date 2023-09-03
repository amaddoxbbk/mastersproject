import React, { useState } from "react";
import {
  Button,
  FormControl,
  FormLabel,
  Input,
  Checkbox,
  Stack,
  HStack,
  Flex,
  Box,
} from "@chakra-ui/react";
import { ReusableModal } from "./ReusableModal";
import WriteData from "./WriteData";
import { useEvent } from "./EventContext";
import { set, z } from "zod";

interface AddCoupleButtonProps {
  setShouldRefetch: React.Dispatch<React.SetStateAction<boolean>>; // Add this line
}

export const AddCoupleButton: React.FC<AddCoupleButtonProps> = ({
  setShouldRefetch,
}) => {
  const { eventData } = useEvent();
  const eventId = eventData.event_id;

  const [isOpen, setIsOpen] = useState(false);
  const [nameOne, setNameOne] = useState("");
  const [nameTwo, setNameTwo] = useState("");
  const [isGroomOne, setIsGroomOne] = useState(false);
  const [isBrideOne, setIsBrideOne] = useState(false);
  const [isGroomTwo, setIsGroomTwo] = useState(false);
  const [isBrideTwo, setIsBrideTwo] = useState(false);
  const [shouldWriteData, setShouldWriteData] = useState(false);
  const [fieldErrors, setFieldErrors] = useState<{ [key: string]: string }>({});

  const newCoupleSchema = z
    .object({
      nameOne: z.string().min(3, "Name One is required"),
      isGroomOne: z.boolean(),
      isBrideOne: z.boolean(),
      nameTwo: z.string().min(3, "Name Two is required"),
      isGroomTwo: z.boolean(),
      isBrideTwo: z.boolean(),
    })
    .refine(
      (data) => {
        return (
          (data.isGroomOne && !data.isBrideOne) ||
          (!data.isGroomOne && data.isBrideOne)
        );
      },
      {
        message: "Please select a status for person one",
        path: ["isGroomOne", "isBrideOne"],
      }
    )
    .refine(
      (data) => {
        return (
          (data.isGroomTwo && !data.isBrideTwo) ||
          (!data.isGroomTwo && data.isBrideTwo)
        );
      },
      {
        message: "Please select a status for person two",
        path: ["isGroomTwo", "isBrideTwo"],
      }
    );

  const handleCoupleSubmit = () => {
    const parsedData = newCoupleSchema.safeParse({
      nameOne,
      isGroomOne,
      isBrideOne,
      nameTwo,
      isGroomTwo,
      isBrideTwo,
    });

    if (!parsedData.success) {
      const errors: { [key: string]: string } = {};
      parsedData.error.issues.forEach((issue) => {
        errors[issue.path[0]] = issue.message;
      });
      setFieldErrors(errors);
      return;
    }

    if (eventId === undefined) {
      console.error("Event ID is undefined. Aborting submit.");
      return;
    }

    setShouldWriteData(true);
    setIsOpen(false);
  };

  const onSuccess = () => {
    setNameOne("");
    setIsGroomOne(false);
    setIsBrideOne(false);
    setNameTwo("");
    setIsGroomTwo(false);
    setIsBrideTwo(false);
    setShouldWriteData(false);
    setShouldRefetch(true);
  };

  const onFailure = (error: any) => {
    console.error("There was an error adding the couple", error);
    setShouldWriteData(false);
  };

  const form = (
    <>
      <Stack spacing={6}>
        <FormControl>
          <Box
            width="100%"
            color="red"
            height={fieldErrors.nameOne ? "auto" : "0"}
          >
            {fieldErrors.nameOne}
          </Box>
          <FormLabel>First Person</FormLabel>
          <Input value={nameOne} onChange={(e) => setNameOne(e.target.value)} />
        </FormControl>
        <Box
          width="100%"
          height={
            fieldErrors.isGroomOne || fieldErrors.isBrideOne ? "auto" : "0"
          }
          mb={fieldErrors.isGroomOne || fieldErrors.isBrideOne ? 4 : 0} // Conditional bottom margin
        >
          {fieldErrors.isGroomOne && (
            <Box color="red">{fieldErrors.isGroomOne}</Box>
          )}
          {fieldErrors.isBrideOne && (
            <Box color="red">{fieldErrors.isBrideOne}</Box>
          )}
        </Box>
        <HStack mt={-8}>
          <Flex direction="column" align="start">
            <Checkbox
              isChecked={isGroomOne}
              onChange={(e) => setIsGroomOne(e.target.checked)}
            >
              Groom
            </Checkbox>
          </Flex>
          <Flex direction="column" align="start">
            <Checkbox
              isChecked={isBrideOne}
              onChange={(e) => setIsBrideOne(e.target.checked)}
            >
              Bride
            </Checkbox>
          </Flex>
        </HStack>
        <FormControl>
          <Box
            width="100%"
            color="red"
            height={fieldErrors.nameTwo ? "auto" : "0"}
          >
            {fieldErrors.nameTwo}
          </Box>
          <FormLabel>Second Person</FormLabel>
          <Input value={nameTwo} onChange={(e) => setNameTwo(e.target.value)} />
        </FormControl>
        <Box
          width="100%"
          height={
            fieldErrors.isGroomTwo || fieldErrors.isBrideTwo ? "auto" : "0"
          }
          mb={fieldErrors.isGroomOne || fieldErrors.isBrideOne ? 4 : 0} // Conditional bottom margin
        >
          {fieldErrors.isGroomTwo && (
            <Box color="red">{fieldErrors.isGroomTwo}</Box>
          )}
          {fieldErrors.isBrideTwo && (
            <Box color="red">{fieldErrors.isBrideTwo}</Box>
          )}
        </Box>
        <HStack mt={-8}>
          <Flex direction="column" align="start">
            <Checkbox
              isChecked={isGroomTwo}
              onChange={(e) => setIsGroomTwo(e.target.checked)}
            >
              Groom
            </Checkbox>
          </Flex>
          <Flex direction="column" align="start">
            <Checkbox
              isChecked={isBrideTwo}
              onChange={(e) => setIsBrideTwo(e.target.checked)}
            >
              Bride
            </Checkbox>
          </Flex>
        </HStack>
      </Stack>
    </>
  );

  return (
    <>
      <Button onClick={() => setIsOpen(true)}>Add Couple</Button>
      <ReusableModal
        isOpen={isOpen}
        onClose={() => setIsOpen(false)}
        title="Add Couple"
        handleSubmit={handleCoupleSubmit}
      >
        {form}
      </ReusableModal>
      {shouldWriteData && (
        <>
          <WriteData
            endpoint="/api/addGuest"
            payload={{
              event_id: eventId,
              attendee_name: nameOne,
              is_groom: isGroomOne,
              is_bride: isBrideOne,
            }}
            onSuccess={onSuccess}
            onFailure={onFailure}
          />
          <WriteData
            endpoint="/api/addGuest"
            payload={{
              event_id: eventId,
              attendee_name: nameTwo,
              is_groom: isGroomTwo,
              is_bride: isBrideTwo,
            }}
            onSuccess={onSuccess}
            onFailure={onFailure}
          />
        </>
      )}
    </>
  );
};
