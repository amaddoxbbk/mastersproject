import React, { useEffect, useState } from 'react';

interface FetchDataProps {
  endpoint: string;  // API endpoint
  onSuccess: (data: any) => void;
  onFailure: (error: any) => void;
}

const FetchData: React.FC<FetchDataProps> = ({
  endpoint,
  onSuccess,
  onFailure,
}) => {
  const [data, setData] = useState<any[]>([]);

  useEffect(() => {
    fetch(endpoint)  // Use the endpoint prop
      .then((response) => {
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        return response.json();
      })
      .then((fetchedData) => {
        setData(fetchedData);
        onSuccess(fetchedData);  // Call the onSuccess prop
      })
      .catch((error) => {
        console.error('Error fetching data:', error);  // Log errors
        onFailure(error);  // Call the onFailure prop
      });
  }, [endpoint, onSuccess, onFailure]);  // Add them to the dependency array

  return (
    <div>
      <h1>Fetched Data:</h1>
      <pre>{JSON.stringify(data, null, 2)}</pre>
    </div>
  );
};

export default FetchData;
