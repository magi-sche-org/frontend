import { Box, Card, Stack } from "@mui/material";
import { mockEventList } from "./data";
import CardContent from "@mui/material/CardContent";
import Typography from "@mui/material/Typography";
import { FC, useEffect, useState } from "react";
import { EventClient } from "@/service/api-client/protocol/EventServiceClientPb";
import { GetEventRequest } from "@/service/api-client/protocol/event_pb";
import { AuthorizeClient } from "@/service/api-client/protocol/AuthorizeServiceClientPb";
import { GetTokenRequest } from "@/service/api-client/protocol/authorize_pb";
import { authClient } from "@/service/api-client/client";
import ListButton from "./ListButton";
export type Event = {
  id: number;
  name: string;
};

export const EventList = () => {
  const [eventList, setEventList] = useState<Event[]>([]);
  useEffect(() => {
    const eventListCache: Event[] = (() => {
      let data = localStorage.getItem("event-list");
      if (!data) {
        return process.env.NODE_ENV === "production" ? [] : mockEventList;
      }
      return JSON.parse(data);
    })();
    setEventList(eventListCache);
  }, []);
  return (
    <Stack spacing={1.5}>
      {eventList.map((event) => {
        return <EventCard key={event.id} {...event} />;
      })}
    </Stack>
  );
};

const EventCard: FC<Event> = ({ name }) => {
  return <ListButton text={name} page='/' />;
};
