import React, { useState } from "react";
import { z } from "zod";
import {
  Button,
  Flex,
  Text,
  Tag,
  TagLabel,
  TagCloseButton,
} from "@chakra-ui/react";
import { ReusableModal } from "./ReusableModal";
import GenericDropdown from "./GenericDropdown";
import { useEffect } from "react";

interface TopTableManagerProps {
  initialGuests: any[];
  sizeTopTableNumber: number;
  onTopTableChange: (newTopTableGuests: string[]) => void;
}

const TopTableManager: React.FC<TopTableManagerProps> = ({
  initialGuests,
  sizeTopTableNumber,
  onTopTableChange,
}) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedTopTableGuests, setSelectedTopTableGuests] = useState<string[]>([]);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const topTableSchema = z.object({
    topTableGuests: z.array(z.string()).max(sizeTopTableNumber-2),
  });

   // Create a bidirectional mapping for quick look-up
   const [partnerMapping, setPartnerMapping] = useState<{ [key: string]: string | null }>({});
   const [reversePartnerMapping, setReversePartnerMapping] = useState<{ [key: string]: string | null }>({});
 
   useEffect(() => {
    const newPartnerMapping: { [key: string]: string | null } = {};
    const newReversePartnerMapping: { [key: string]: string | null } = {};

    initialGuests.forEach((guest) => {
      newPartnerMapping[guest.attendee_name] = guest.partner_to
        ? initialGuests.find((g) => g.attendee_id === guest.partner_to)?.attendee_name
        : null;
      if (guest.partner_to) {
        newReversePartnerMapping[
          initialGuests.find((g) => g.attendee_id === guest.partner_to)
            ?.attendee_name || ""
        ] = guest.attendee_name;
      }
    });

    setPartnerMapping(newPartnerMapping);
    setReversePartnerMapping(newReversePartnerMapping);
  }, [initialGuests]);

  const handleModalClose = () => {
    setIsModalOpen(false);
  };

  const handleModalSubmit = () => {
    const validationResult = topTableSchema.safeParse({
      topTableGuests: selectedTopTableGuests,
    });

    if (validationResult.success) {
      onTopTableChange(selectedTopTableGuests);
      handleModalClose();
      setErrorMessage(null);
    } else {
      const excessGuests = selectedTopTableGuests.length - (sizeTopTableNumber-2);
      setErrorMessage(
        `Too many guests for the top table. Please remove ${excessGuests} guests.`
      );
    }
  };

  const handleGuestSelect = (guestName: string) => {
    const partnerName = partnerMapping[guestName] || reversePartnerMapping[guestName] || null;

    let updatedTopTableGuests = [...selectedTopTableGuests];

    if (selectedTopTableGuests.includes(guestName)) {
      updatedTopTableGuests = updatedTopTableGuests.filter(
        (name) => name !== guestName && name !== partnerName
      );
    } else {
      updatedTopTableGuests.push(guestName);
      if (partnerName) {
        updatedTopTableGuests.push(partnerName);
      }
    }

    setSelectedTopTableGuests(updatedTopTableGuests);
  };

  const removeTopTableGuest = (name: string) => {
    // Find the partner of the guest to be removed
    const partnerName = partnerMapping[name] || reversePartnerMapping[name] || null;
  
    let updatedTopTableGuests = [...selectedTopTableGuests].filter(
      (guestName) => guestName !== name && guestName !== partnerName // Remove both the guest and their partner
    );
  
    setSelectedTopTableGuests(updatedTopTableGuests);
  };
  

  const availableGuestOptions = initialGuests
    .filter(
      (guest) =>
        !selectedTopTableGuests.includes(guest.attendee_name) &&
        !guest.is_bride &&
        !guest.is_groom
    )
    .map((guest) => ({
      value: guest.attendee_name,
      label: guest.attendee_name,
    }));

  const sortedAvailableGuestOptions = [...availableGuestOptions].sort((a, b) => {
    if (a.label < b.label) {
      return -1;
    }
    if (a.label > b.label) {
      return 1;
    }
    return 0;
  });

  return (
    <div>
      <Button onClick={() => setIsModalOpen(true)}>Assign Top Table</Button>
      <ReusableModal
        isOpen={isModalOpen}
        onClose={handleModalClose}
        title="Select Top Table Guests"
        handleSubmit={handleModalSubmit}
      >
        <GenericDropdown
          onSelect={handleGuestSelect}
          selectedValue={selectedTopTableGuests}
          options={sortedAvailableGuestOptions}
          title="Select Guests"
        />
        {errorMessage && <Text color="red.500">{errorMessage}</Text>}
        {selectedTopTableGuests.length > 0 && (
          <Flex mt={2} flexWrap="wrap">
            {selectedTopTableGuests.map((name, index) => (
              <Tag
                size="md"
                key={index}
                variant="solid"
                colorScheme="blue"
                m={1}
              >
                <TagLabel>{name}</TagLabel>
                <TagCloseButton onClick={() => removeTopTableGuest(name)} />
              </Tag>
            ))}
          </Flex>
        )}
      </ReusableModal>
    </div>
  );
};

export default TopTableManager;
