import React, { useEffect, useState } from "react";
import {
  Button,
  FormControl,
  FormLabel,
  Input,
  Checkbox,
  Stack,
  HStack,
  Tag,
  TagLabel,
  TagCloseButton,
} from "@chakra-ui/react";
import { ReusableModal } from "./ReusableModal";
import WriteData from "./WriteData";
import { useEvent } from "./EventContext";
import GenericDropdown from "./GenericDropdown";
import { set, z } from "zod"; // Import Zod

interface BrideOrGroom {
  name: string;
  role: "bride" | "groom";
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
  relationship: z
    .string()
    .refine((value) => value !== "" && value !== "Relationship: Select", {
      message: "Please select a relationship",
    }),
  guest_allergies: z.string().optional(),
  plusOneAllergies: z.string().optional(),

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
    guests.forEach((guest) => {
      if (guest.is_bride) {
        bridesAndGroomsArray.push({ name: guest.attendee_name, role: "bride" });
      }
      if (guest.is_groom) {
        bridesAndGroomsArray.push({ name: guest.attendee_name, role: "groom" });
      }
    });
    setBridesAndGrooms(bridesAndGroomsArray);
  }, [guests]);

  const relationshipOptions = bridesAndGrooms
    .map(({ name, role }) => [
      { value: `family_of_${role}`, label: `Family of ${name}` },
      { value: `friends_of_${role}`, label: `Friends of ${name}` },
    ])
    .flat();

  const [isOpen, setIsOpen] = useState(false);
  const [name, setName] = useState("");
  const [plusOne, setPlusOne] = useState("");
  const [relationship, setRelationship] = useState("");
  const [guest_allergies, setGuestAllergies] = useState("");
  const [plusOneAllergies, setPlusOneAllergies] = useState("");
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
    .filter((guest) => {
      // Exclude brides and grooms from the blacklist dropdown
      const isBrideOrGroom = bridesAndGrooms.some(
        (bg) =>
          bg.name === guest.attendee_name &&
          (bg.role === "bride" || bg.role === "groom")
      );
      // Exclude names that are already in the blacklist
      const isAlreadyBlacklisted = selectedBlacklist.includes(
        guest.attendee_id
      );
      return (
        guest.attendee_name &&
        guest.attendee_name.trim() !== "" &&
        !isBrideOrGroom &&
        !isAlreadyBlacklisted
      );
    })
    .map((guest) => ({
      value: guest.attendee_id,
      label: guest.attendee_name,
    }));

  const removeBlacklistGuest = (id: string) => {
    setSelectedBlacklist(selectedBlacklist.filter((item) => item !== id));
  };

  const handleGuestSubmit = () => {
    const parsedData = newGuestSchema.safeParse({
      name,
      plusOne,
      relationship,
      guest_allergies,
      plusOneAllergies,
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
    setRelationship("");
    setGuestAllergies("");
    setSelectedBlacklist([]);
    setShouldWriteData(false);
    setShouldRefetch(true);
    setShowPlusOne(false);
    setFieldErrors({});
    setPlusOneAllergies("");
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
                <HStack mt={2} spacing={4}>
                  {selectedBlacklist.map((id, index) => (
                    <Tag
                      size="md"
                      key={index}
                      variant="solid"
                      colorScheme="red"
                    >
                      <TagLabel>{getBlacklistNameById(id)}</TagLabel>
                      <TagCloseButton
                        onClick={() => removeBlacklistGuest(id)}
                      />
                    </Tag>
                  ))}
                </HStack>
              )}
            </>
          ) : (
            <p>No guests available for blacklist.</p>
          )}
        </FormControl>

        <FormControl>
          <FormLabel>Guest Allergies</FormLabel>
          <Input
            value={guest_allergies}
            onChange={(e) => setGuestAllergies(e.target.value)}
          />
        </FormControl>

        {showPlusOne && (
  <FormControl>
    <FormLabel>Plus One Allergies</FormLabel>
    <Input
      value={plusOneAllergies}
      onChange={(e) => setPlusOneAllergies(e.target.value)}
    />
  </FormControl>
)}
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
            guest_allergies,
            plusone_allergies: plusOneAllergies,  // new field
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
