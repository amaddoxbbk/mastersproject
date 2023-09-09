import React, { useEffect, useState } from 'react';
import { useEvent } from './components/EventContext';
import axios from 'axios';

const PlanBuilder = () => {
  const { eventData } = useEvent();
  const [guests, setGuests] = useState<any[]>([]);
  const [eventInfo, setEventInfo] = useState<any>(null);

  useEffect(() => {
    const fetchGuests = async () => {
      try {
        const response = await axios.post("/api/getGuests", {
          event_id: eventData.event_id,
        });
        setGuests(response.data);
      } catch (error) {
        console.error("Error fetching guests:", error);
      }
    };

    fetchGuests();
  }, []);

  useEffect(() => {
    const fetchEventInfo = async () => {
      try {
        const response = await axios.post("/api/getOneEvent", {
          event_id: eventData.event_id,
        });
        setEventInfo(response.data);
      } catch (error) {
        console.error("Error fetching event information:", error);
      }
    };

    fetchEventInfo();
  }, []);

  const { num_top_tables, size_top_tables, num_normal_tables, size_normal_tables } = eventInfo || {};

  return (
    <div>
      <h1>Welcome to {eventData.event_name}</h1>
      <h2>Event ID: {eventData.event_id}</h2>
      <h2>Number of Top Tables: {num_top_tables}</h2>
      <h2>Size of Top Tables: {size_top_tables}</h2>
      <h2>Number of Normal Tables: {num_normal_tables}</h2>
      <h2>Size of Normal Tables: {size_normal_tables}</h2>
      <h2>Guests:</h2>
      <ul>
        {guests.map((guest) => (
          <li key={guest.attendee_id}>{guest.attendee_name}</li>
        ))}
      </ul>
    </div>
  );
};

export default PlanBuilder;
