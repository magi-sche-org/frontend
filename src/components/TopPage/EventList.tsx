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
import {getEventStorage} from "@/libraries/eventStorage";
export type Event = {
  id: string;
  name: string;
  answered: boolean;
};

export const EventList = () => {
  const [eventList, setEventList] = useState<Event[]>([]);
  useEffect(() => {
    if (typeof window !== "object")return;
    setEventList(getEventStorage());
  }, []);
  return (
    <Stack spacing={1.5}>
      {eventList.map((event) => {
        return <EventCard key={event.id} {...event} />;
      })}
    </Stack>
  );
};

const EventCard: FC<Event> = ({ name, id }) => {
  return <ListButton text={name} page={`/detail/${id}`} />;
};
