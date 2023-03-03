import {Stack, Typography} from "@mui/material";
import { FC, useEffect, useState } from "react";
import ListButton from "./ListButton";
import { getEventStorage } from "@/libraries/eventStorage";
export type Event = {
  id: string;
  name: string;
  answered: boolean;
};

export const EventList = () => {
  const [eventList, setEventList] = useState<Event[]>([]);
  useEffect(() => {
    if (typeof window !== "object") return;
    setEventList(getEventStorage());
  }, []);
  return (
    <Stack spacing={1.5}>
      {eventList.length===0&&
          <Typography variant='body1' sx={{ color: "white", textAlign: "center" }}>
            ここにはまだなにもありません
          </Typography>}
      {eventList.map((event) => {
        return <EventCard key={event.id} {...event} />;
      })}
    </Stack>
  );
};

const EventCard: FC<Event> = ({ name, id }) => {
  return <ListButton text={name} page={`/detail/${id}`} />;
};
