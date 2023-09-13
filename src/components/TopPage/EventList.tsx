import { Stack, Typography } from "@mui/material";
import { useEffect, useState } from "react";
import ListButton from "./ListButton";
import { getEventStorage } from "@/libraries/eventStorage";
import { IEvent } from "@/@types/api/event";

export const EventList = () => {
  const [eventList, setEventList] = useState<IEvent[]>([]);
  useEffect(() => {
    if (typeof window !== "object") return;
    setEventList(getEventStorage());
  }, []);
  return (
    <Stack spacing={1.5}>
      {eventList.length === 0 && (
        <Typography
          variant="body1"
          sx={{ color: "white", textAlign: "center" }}
        >
          ここにはまだなにもありません
        </Typography>
      )}
      {eventList.map((event) => {
        return (
          <EventCard
            key={event.id + event.name}
            name={event.name}
            eventId={event.id}
          />
        );
      })}
    </Stack>
  );
};

const EventCard = ({ name, eventId }: { name: string; eventId: string }) => {
  return <ListButton text={name} page={`/detail/${eventId}`} />;
};
