// WriteData.tsx
import React from "react";
import axios from "axios";

interface WriteDataProps {
  endpoint: string;  // API endpoint
  payload: Object;  // Data payload
  onSuccess: () => void;
  onFailure: (error: any) => void;
}

const WriteData: React.FC<WriteDataProps> = ({
  endpoint,
  payload,
  onSuccess,
  onFailure,
}) => {
  React.useEffect(() => {
    axios
      .post(endpoint, payload)
      .then((res) => {
        if (res.status === 200) {
          onSuccess();
        }
      })
      .catch((error) => {
        onFailure(error);
      });
  }, [endpoint, payload, onSuccess, onFailure]);

  return null;
};

export default WriteData;
