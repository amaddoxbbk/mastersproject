import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from "react";
import axios from "axios";

interface EventData {
  event_name?: string;
  event_id?: number;
}

interface EventContextProps {
  eventData: EventData;
  setEventData: React.Dispatch<React.SetStateAction<EventData>>;
}

interface EventProviderProps {
  children: ReactNode;
}

const EventContext = createContext<EventContextProps | undefined>(undefined);

export const useEvent = (): EventContextProps => {
  const context = useContext(EventContext);
  if (!context) {
    throw new Error("useEvent must be used within an EventProvider");
  }
  return context;
};

export const EventProvider: React.FC<EventProviderProps> = ({ children }) => {
  // Initialize state with data from localStorage if available
  const [eventData, setEventData] = useState<EventData>(() => {
    const savedData = localStorage.getItem("eventData"); // Added this line
    return savedData ? JSON.parse(savedData) : {}; // Modified this line
  });

  // Save to localStorage whenever eventData changes
  useEffect(() => {
    localStorage.setItem("eventData", JSON.stringify(eventData)); // Added this line
  }, [eventData]);

  useEffect(() => {
    axios
      .get("/api/getEvents")
      .then((response) => {
        // Only set to default if no eventData is present
        if (!eventData.event_id && !eventData.event_name) { // Added this line
          setEventData({ event_name: "Default Event", event_id: 0 });
        }
      })
      .catch((error) => {
        console.error("There was an error fetching the event data", error);
      });
  }, []);

  return (
    <EventContext.Provider value={{ eventData, setEventData }}>
      {children}
    </EventContext.Provider>
  );
};
