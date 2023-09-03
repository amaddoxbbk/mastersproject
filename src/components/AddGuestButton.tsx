import React, { useEffect, useState } from "react";
import {
  Button,
  FormControl,
  FormLabel,
  Input,
  Checkbox,
  Stack,
  HStack,
} from "@chakra-ui/react";
import { ReusableModal } from "./ReusableModal";
import WriteData from "./WriteData";
import { useEvent } from "./EventContext";
import GenericDropdown from "./GenericDropdown";
import { set, z } from "zod"; // Import Zod

interface BrideOrGroom {
  name: string;
  role: 'bride' | 'groom';
}
// Define Zod schema
const newGuestSchema = z.object({
  name: z.string().min(3, "Guest name is required"),
  plusOne: z
    .string()
    .optional()
    .refine(
      (value) => value === undefined || value === "" || value.length >= 3,
      {
        message: "Plus One name must be at least 3 characters long",
      }
    ),
// ADD VALIDATION FOR RELATIONSHIP
  specialStatus: z.string().optional(),
});

interface AddGuestButtonProps {
  guests: any[];
  setShouldRefetch: React.Dispatch<React.SetStateAction<boolean>>;
}

export const AddGuestButton: React.FC<AddGuestButtonProps> = ({
  guests,
  setShouldRefetch,
}) => {
  const { eventData } = useEvent();
  const eventId = eventData.event_id;
  const [bridesAndGrooms, setBridesAndGrooms] = useState<BrideOrGroom[]>([]);

  const getBlacklistNameById = (id: string) => {
    const guest = guests.find((guest) => guest.attendee_id === id);
    return guest ? guest.attendee_name : "Unknown";
  };

  useEffect(() => {
    const bridesAndGroomsArray: BrideOrGroom[] = [];
    guests.forEach(guest => {
      if (guest.is_bride) {
        bridesAndGroomsArray.push({ name: guest.attendee_name, role: 'bride' });
      }
      if (guest.is_groom) {
        bridesAndGroomsArray.push({ name: guest.attendee_name, role: 'groom' });
      }
    });
    setBridesAndGrooms(bridesAndGroomsArray);
  }, [guests]);

  const relationshipOptions = bridesAndGrooms.map(({ name, role }) => [
    { value: `family_of_${role}`, label: `Family of ${name}` },
    { value: `friends_of_${role}`, label: `Friends of ${name}` },
  ]).flat();

  const [isOpen, setIsOpen] = useState(false);
  const [name, setName] = useState("");
  const [plusOne, setPlusOne] = useState("");
  const [relationship, setRelationship] = useState("");
  const [specialStatus, setSpecialStatus] = useState("");
  const [shouldWriteData, setShouldWriteData] = useState(false);
  const [selectedBlacklist, setSelectedBlacklist] = useState<string[]>([]);
  const [fieldErrors, setFieldErrors] = useState<{ [key: string]: string }>({});
  const [isBride, setIsBride] = useState(false);
  const [isGroom, setIsGroom] = useState(false);
  const [showPlusOne, setShowPlusOne] = useState(false);

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
    });

    if (!parsedData.success) {
      const errors: { [key: string]: string } = {};
      parsedData.error.issues.forEach((issue) => {
        if (
          issue.path[0] === "relationship" &&
          issue.code === "invalid_enum_value"
        ) {
          errors[issue.path[0]] = "Please select a relationship";
        } else {
          errors[issue.path[0]] = issue.message;
        }
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
    setName("");
    setPlusOne("");
    setRelationship(""); // Reset relationship
    setSpecialStatus(""); // Reset special status
    setSelectedBlacklist([]); // Reset blacklist
    setShouldWriteData(false);
    setShouldRefetch(true);
    setShowPlusOne(false);
    setFieldErrors({}); // Reset all field errors
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
      <Stack spacing={6}>
        <FormControl>
          {fieldErrors.name && (
            <div style={{ color: "red" }}>{fieldErrors.name}</div>
          )}
          <FormLabel>Guest Name</FormLabel>
          <Input value={name} onChange={(e) => setName(e.target.value)} />
        </FormControl>

        <HStack spacing={2}>
          <FormLabel>Plus One:</FormLabel>
          <Checkbox
            isChecked={showPlusOne}
            onChange={() => setShowPlusOne(true)}
          >
            Yes
          </Checkbox>
          <Checkbox
            isChecked={!showPlusOne}
            onChange={() => setShowPlusOne(false)}
          >
            No
          </Checkbox>
        </HStack>

        {showPlusOne && (
          <FormControl mt={-2}>
            {fieldErrors.plusOne && (
              <div style={{ color: "red" }}>{fieldErrors.plusOne}</div>
            )}
            <FormLabel>Plus One</FormLabel>
            <Input
              value={plusOne}
              onChange={(e) => setPlusOne(e.target.value)}
            />
          </FormControl>
        )}

        <FormControl>
          {fieldErrors.relationship && (
            <div style={{ color: "red" }}>{fieldErrors.relationship}</div>
          )}
          <FormLabel>Relationship</FormLabel>
          <GenericDropdown
            onSelect={(value) => setRelationship(value)}
            selectedValue={relationship}
            options={relationshipOptions}
            title="Relationship"
          />
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
          <Input
            value={specialStatus}
            onChange={(e) => setSpecialStatus(e.target.value)}
          />
        </FormControl>
      </Stack>
    </>
  );

  return (
    <>
      <Button onClick={() => setIsOpen(true)}>Add Guest</Button>
      <ReusableModal
        isOpen={isOpen}
        onClose={() => setIsOpen(false)}
        title="Add New Guest"
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
