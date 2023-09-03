import React, { useState } from "react";
import { Button } from "@chakra-ui/react";
import { ReusableModal } from "./ReusableModal";
import WriteData from "./WriteData";
import { useEvent } from "./EventContext";

interface RemoveCoupleButtonProps {
  setShouldRefetch: React.Dispatch<React.SetStateAction<boolean>>;
}

export const RemoveCoupleButton: React.FC<RemoveCoupleButtonProps> = ({
  setShouldRefetch,
}) => {
  const { eventData } = useEvent();
  const [isOpen, setIsOpen] = useState(false);
  const [shouldWriteData, setShouldWriteData] = useState(false);

  const handleCoupleRemove = () => {
    if (!eventData.event_id) {
      console.error("Event ID is undefined. Aborting remove.");
      return;
    }

    setShouldWriteData(true);
    setIsOpen(false);
  };

  const onSuccess = () => {
    setShouldWriteData(false);
    setShouldRefetch(true);
  };

  const onFailure = (error: any) => {
    console.error("There was an error removing the couple", error);
    setShouldWriteData(false);
  };

  return (
    <>
      <Button onClick={() => setIsOpen(true)}>Remove Couple</Button>
      <ReusableModal
        isOpen={isOpen}
        onClose={() => setIsOpen(false)}
        title="Remove Couple"
        handleSubmit={handleCoupleRemove}
      >
        Are you sure you want to remove the couple?
      </ReusableModal>
      {shouldWriteData && (
        <WriteData
          endpoint="/api/removeCouple"
          payload={{
            event_id: eventData.event_id,
            is_bride: true,
            is_groom: true,
          }}
          onSuccess={onSuccess}
          onFailure={onFailure}
        />
      )}
    </>
  );
};
