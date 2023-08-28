// WriteData.tsx
import React from "react";
import axios from "axios";

interface WriteDataProps {
  attendee: string;
  plusOne: string;
  onSuccess: () => void;
  onFailure: (error: any) => void;
}

const WriteData: React.FC<WriteDataProps> = ({
  attendee,
  plusOne,
  onSuccess,
  onFailure,
}) => {
  React.useEffect(() => {
    const payload = {
      attendee,
      plus_one: plusOne,
    };

    axios
      .post("/api/addUser", payload)
      .then((res) => {
        if (res.status === 200) {
          onSuccess();
        }
      })
      .catch((error) => {
        onFailure(error);
      });
  }, [attendee, plusOne, onSuccess, onFailure]);

  return null;
};

export default WriteData;
