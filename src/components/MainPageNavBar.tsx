// src/components/PlanBuilderNavBar/PlanBuilderNavBar.tsx

import React, { Dispatch, SetStateAction, useState, useEffect } from "react";
import { HStack, Button, Text } from "@chakra-ui/react";
import { useNavigate } from "react-router-dom";
import { useEvent } from "./EventContext";
import { EditExistingEventButton } from "./EditExistingEventButton";
import axios from "axios";
import { ReusableModal } from "./ReusableModal";

interface MainPageNavBarProps {
  setShouldRefetch: Dispatch<SetStateAction<boolean>>;
}

const MainPageNavBar: React.FC<MainPageNavBarProps> = ({
  setShouldRefetch,
}) => {
  const { eventData } = useEvent();
  const [guests, setGuests] = useState<any[]>([]);
  const [eventInfo, setEventInfo] = useState<any>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [guestsResponse, eventInfoResponse] = await Promise.all([
          axios.post("/api/getGuests", {
            event_id: eventData.event_id,
          }),
          axios.post("/api/getOneEvent", {
            event_id: eventData.event_id,
          }),
        ]);

        setGuests(guestsResponse.data);
        setEventInfo(eventInfoResponse.data);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };
    fetchData();
  }, [eventData.event_id]);

  const hasTooManyGuests = () => {
    const guestCount = guests.length;
    const {
      num_top_tables,
      size_top_tables,
      num_normal_tables,
      size_normal_tables,
    } = eventInfo || {};

    const totalEventCapacity =
      num_top_tables * size_top_tables + num_normal_tables * size_normal_tables;

    return guestCount > totalEventCapacity;
  };

  return (
    <HStack mt={6} mb={2} ml={2} width="100%" justifyContent="space-between">
      <HStack spacing={3}>
        <Button onClick={() => navigate("/home")}>
          <i className="fa fa-home" style={{ fontSize: "30px" }}></i>
        </Button>
        <Text fontSize="2xl" fontWeight="bold" color="black">
          Welcome to {eventData.event_name}
        </Text>
      </HStack>
      <HStack spacing={3} mr={6}>
        <Button
          onClick={() => {
            if (hasTooManyGuests()) {
              setIsModalOpen(true);
            } else {
              navigate("/plan-builder");
            }
          }}
        >
          Go To Plan Builder
        </Button>
        {isModalOpen && (
          <ReusableModal
            isOpen={isModalOpen}
            onClose={() => setIsModalOpen(false)}
            title="Warning"
            handleSubmit={() => setIsModalOpen(false)}
          >
            <p>
              The total capacity for this event is{" "}
              {eventInfo
                ? eventInfo.num_top_tables * eventInfo.size_top_tables +
                  eventInfo.num_normal_tables * eventInfo.size_normal_tables
                : ""}{" "}
              but you have {guests.length} guests. Please remove{" "}
              {guests.length -
                (eventInfo
                  ? eventInfo.num_top_tables * eventInfo.size_top_tables +
                    eventInfo.num_normal_tables * eventInfo.size_normal_tables
                  : 0)}{" "}
              guests before continuing.
            </p>
          </ReusableModal>
        )}
      </HStack>
    </HStack>
  );
};

export default MainPageNavBar;
