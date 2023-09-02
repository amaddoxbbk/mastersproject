import React, { useState } from "react";
import {
  Button,
  FormControl,
  FormLabel,
  Input,
  Checkbox,
} from "@chakra-ui/react";
import { ReusableModal } from "./ReusableModal";
import WriteData from "./WriteData";
import { useEvent } from "./EventContext";
import GenericDropdown from "./GenericDropdown";
import { z } from "zod"; // Import Zod

// Define Zod schema
const newGuestSchema = z.object({
  name: z.string().min(3, "Guest name is required"),
  plusOne: z.string().optional().refine(value => value === undefined || value.length >= 3, {
    message: "Plus One name must be at least 3 characters long",
  }),
  relationship: z.string().optional(),
  specialStatus: z.string().optional(),
  isBride: z.boolean(),
  isGroom: z.boolean(),
});

interface AddGuestButtonProps {
  addGuestToList: (name: string) => void;
  guests: any[];
}

export const AddGuestButton: React.FC<AddGuestButtonProps> = ({
  addGuestToList,
  guests,
}) => {
  const { eventData } = useEvent();
  const eventId = eventData.event_id;

  const getBlacklistNameById = (id: string) => {
    const guest = guests.find((guest) => guest.attendee_id === id);
    return guest ? guest.attendee_name : "Unknown";
  };

  const [isOpen, setIsOpen] = useState(false);
  const [name, setName] = useState("");
  const [plusOne, setPlusOne] = useState("");
  const [relationship, setRelationship] = useState("");
  const [specialStatus, setSpecialStatus] = useState("");
  const [isBride, setIsBride] = useState(false);
  const [isGroom, setIsGroom] = useState(false);
  const [shouldWriteData, setShouldWriteData] = useState(false);
  const [selectedBlacklist, setSelectedBlacklist] = useState<string[]>([]);
  const [fieldErrors, setFieldErrors] = useState<{ [key: string]: string }>({});

  const handleBlacklistChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const selectedOptions = Array.from(e.target.selectedOptions).map(
      (option) => option.value
    );
    setSelectedBlacklist(selectedOptions);
  };

  const handleSelect = (value: string) => {
    if (selectedBlacklist.includes(value)) {
      setSelectedBlacklist(selectedBlacklist.filter((item) => item !== value));
    } else {
      setSelectedBlacklist([...selectedBlacklist, value]);
    }
  };

  const options = guests
    .filter((guest) => guest.attendee_name && guest.attendee_name.trim() !== "")
    .map((guest) => ({
      value: guest.attendee_id,
      label: guest.attendee_name,
    }));

  const handleGuestSubmit = () => {
    const parsedData = newGuestSchema.safeParse({
      name,
      plusOne,
      relationship,
      specialStatus,
      isBride,
      isGroom,
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
    addGuestToList(name);
    setName("");
    setPlusOne("");
    setShouldWriteData(false);
  };

  const onFailure = (error: any) => {
    console.error("There was an error adding the guest", error);
    setShouldWriteData(false);
  };

  const getBlacklistNames = () => {
    return selectedBlacklist.map((id) => getBlacklistNameById(id));
  };

  const form = (
    <>
      <FormControl>
        {fieldErrors.name && <div style={{ color: "red" }}>{fieldErrors.name}</div>}
        <FormLabel>Guest Name</FormLabel>
        <Input value={name} onChange={(e) => setName(e.target.value)} />
      </FormControl>
      <FormControl>
  {fieldErrors.plusOne && <div style={{ color: "red" }}>{fieldErrors.plusOne}</div>}
  <FormLabel>Plus One</FormLabel>
  <Input value={plusOne} onChange={(e) => setPlusOne(e.target.value)} />
</FormControl>
      <FormControl>
        <FormLabel>Relationship</FormLabel>
        <Input value={relationship} onChange={(e) => setRelationship(e.target.value)} />
      </FormControl>
      <FormControl>
        <FormLabel>Blacklist Attendee IDs</FormLabel>
        {guests && guests.length > 0 ? (
          <>
            <GenericDropdown
              onSelect={handleSelect}
              selectedValue={selectedBlacklist}
              options={options}
              title="Blacklist"
            />
            {selectedBlacklist.length > 0 && (
              <div>
                <h3>Blacklisted Guests:</h3>
                <ul>
                  {selectedBlacklist.map((id, index) => (
                    <li key={index}>{getBlacklistNameById(id)}</li>
                  ))}
                </ul>
              </div>
            )}
          </>
        ) : (
          <p>No guests available for blacklist.</p>
        )}
      </FormControl>
      <FormControl>
        <FormLabel>Special Status</FormLabel>
        <Input value={specialStatus} onChange={(e) => setSpecialStatus(e.target.value)} />
      </FormControl>
      <FormControl>
        <Checkbox isChecked={isBride} onChange={(e) => setIsBride(e.target.checked)}>
          Is Bride
        </Checkbox>
      </FormControl>
      <FormControl>
        <Checkbox isChecked={isGroom} onChange={(e) => setIsGroom(e.target.checked)}>
          Is Groom
        </Checkbox>
      </FormControl>
    </>
  );

  return (
    <>
      <Button onClick={() => setIsOpen(true)}>Add Guest</Button>
      <ReusableModal
        isOpen={isOpen}
        onClose={() => setIsOpen(false)}
        title="New Guest"
        handleSubmit={handleGuestSubmit}
      >
        {form}
      </ReusableModal>
      {shouldWriteData && (
        <WriteData
          endpoint="/api/addGuest"
          payload={{
            event_id: eventId,
            attendee_name: name,
            plus_one_name: plusOne,
            relationship,
            blacklist_attendee_ids: selectedBlacklist,
            blacklist_attendee_names: getBlacklistNames(),
            special_status: specialStatus,
            is_bride: isBride,
            is_groom: isGroom,
          }}
          onSuccess={onSuccess}
          onFailure={onFailure}
        />
      )}
    </>
  );
};
