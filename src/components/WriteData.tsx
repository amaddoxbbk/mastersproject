import React from "react";
import axios from "axios";

interface WriteDataProps {
  endpoint: string;
  payload: Object;
  onSuccess: (data?: any) => void;
  onFailure: (error: any) => void;
}

const WriteData: React.FC<WriteDataProps> = ({
  endpoint,
  payload,
  onSuccess,
  onFailure,
}) => {
  React.useEffect(() => {
    console.log("WriteData useEffect triggered: ", endpoint);
    axios
      .post(endpoint, payload)
      .then((res) => {
        if (res.status === 200) {
          onSuccess(res.data);
        }
      })
      .catch((error) => {
        onFailure(error);
      });
  }, [endpoint, payload, onSuccess, onFailure]);

  return null;
};

export default WriteData;
