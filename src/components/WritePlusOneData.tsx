import React, { useEffect } from "react";
import axios from "axios";

interface WritePlusOneDataProps {
  endpoint: string;
  payload: any;
  onSuccess: () => void;
  onFailure: (error: any) => void;
}

const WritePlusOneData: React.FC<WritePlusOneDataProps> = ({
  endpoint,
  payload,
  onSuccess,
  onFailure,
}) => {
  useEffect(() => {
    const writeData = async () => {
      try {
        const response = await axios.post(endpoint, payload);
        if (response.status === 200) {
          onSuccess();
        } else {
          onFailure(new Error("Received non-OK status code from API"));
        }
      } catch (error) {
        onFailure(error);
      }
    };

    writeData();
  }, [endpoint, payload, onSuccess, onFailure]);

  return null;
};

export default WritePlusOneData;
