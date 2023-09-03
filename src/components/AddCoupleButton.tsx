import React, { useState } from "react";
import { Button, FormControl, FormLabel, Input, Checkbox } from "@chakra-ui/react";
import { ReusableModal } from "./ReusableModal";
import WriteData from "./WriteData";
import { useEvent } from "./EventContext";
import { set, z } from "zod";

interface AddCoupleButtonProps {
    setShouldRefetch: React.Dispatch<React.SetStateAction<boolean>>; // Add this line
  }

  export const AddCoupleButton: React.FC<AddCoupleButtonProps> = ({ setShouldRefetch }) => {
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

const newCoupleSchema = z.object({
  nameOne: z.string().min(3, "Name One is required"),
  isGroomOne: z.boolean(),
  isBrideOne: z.boolean(),
  nameTwo: z.string().min(3, "Name Two is required"),
  isGroomTwo: z.boolean(),
  isBrideTwo: z.boolean(),
});

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
    <FormControl>
      {fieldErrors.nameOne && <div style={{ color: "red" }}>{fieldErrors.nameOne}</div>}
      <FormLabel>Name One</FormLabel>
      <Input value={nameOne} onChange={(e) => setNameOne(e.target.value)} />
    </FormControl>
    <FormControl>
      {fieldErrors.isGroomOne && <div style={{ color: "red" }}>{fieldErrors.isGroomOne}</div>}
      <Checkbox isChecked={isGroomOne} onChange={(e) => setIsGroomOne(e.target.checked)}>
        Is Groom
      </Checkbox>
    </FormControl>
    <FormControl>
      {fieldErrors.isBrideOne && <div style={{ color: "red" }}>{fieldErrors.isBrideOne}</div>}
      <Checkbox isChecked={isBrideOne} onChange={(e) => setIsBrideOne(e.target.checked)}>
        Is Bride
      </Checkbox>
    </FormControl>
    <FormControl>
      {fieldErrors.nameTwo && <div style={{ color: "red" }}>{fieldErrors.nameTwo}</div>}
      <FormLabel>Name Two</FormLabel>
      <Input value={nameTwo} onChange={(e) => setNameTwo(e.target.value)} />
    </FormControl>
    <FormControl>
      {fieldErrors.isGroomTwo && <div style={{ color: "red" }}>{fieldErrors.isGroomTwo}</div>}
      <Checkbox isChecked={isGroomTwo} onChange={(e) => setIsGroomTwo(e.target.checked)}>
        Is Groom
      </Checkbox>
    </FormControl>
    <FormControl>
      {fieldErrors.isBrideTwo && <div style={{ color: "red" }}>{fieldErrors.isBrideTwo}</div>}
      <Checkbox isChecked={isBrideTwo} onChange={(e) => setIsBrideTwo(e.target.checked)}>
        Is Bride
      </Checkbox>
    </FormControl>
  </>
  
  );

  return (
    <>
      <Button onClick={() => setIsOpen(true)}>Add Couple</Button>
      <ReusableModal
        isOpen={isOpen}
        onClose={() => setIsOpen(false)}
        title="New Couple"
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
      )};
    </>
    );
}
