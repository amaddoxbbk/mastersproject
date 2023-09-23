import React, { useEffect, useState } from 'react';

interface FetchDataProps {
  endpoint: string;
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
    fetch(endpoint) 
      .then((response) => {
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        return response.json();
      })
      .then((fetchedData) => {
        setData(fetchedData);
        onSuccess(fetchedData); 
      })
      .catch((error) => {
        console.error('Error fetching data:', error); 
        onFailure(error); 
      });
  }, [endpoint, onSuccess, onFailure]);

  return (
    <div>
      <h1>Fetched Data:</h1>
      <pre>{JSON.stringify(data, null, 2)}</pre>
    </div>
  );
};

export default FetchData;
