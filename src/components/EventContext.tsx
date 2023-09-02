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
  // add more fields as needed
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
  const [eventData, setEventData] = useState<EventData>({});

  useEffect(() => {
    axios
      .get("/api/getEvents")
      .then((response) => {
        setEventData({ event_name: "Default Event", event_id: 0 });
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
