import React, { useEffect, useState } from 'react';

const FetchData: React.FC = () => {
  const [data, setData] = useState<any[]>([]);

  useEffect(() => {
    fetch('/api/users')
      .then((response) => {
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        return response.json();
      })
      .then((data) => {
        console.log("Fetched data:", data);  // Log fetched data
        setData(data);
      })
      .catch((error) => {
        console.error('Error fetching data:', error);  // Log errors
      });
  }, []);

  return (
    <div>
      <h1>Fetched Data:</h1>
      <pre>{JSON.stringify(data, null, 2)}</pre>
    </div>
  );
};

export default FetchData;
