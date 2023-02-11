import { Box, Card } from "@mui/material";
import { mockEventList } from "./data";
import CardContent from "@mui/material/CardContent";
import Typography from "@mui/material/Typography";
import { FC, useEffect } from "react";
import { EventClient } from "@/service/api-client/protocol/EventServiceClientPb";
import { GetEventRequest } from "@/service/api-client/protocol/event_pb";
import { AuthorizeClient } from "@/service/api-client/protocol/AuthorizeServiceClientPb";
import { GetTokenRequest } from "@/service/api-client/protocol/authorize_pb";
import { authClient } from "@/service/api-client/client";
export type Event = {
  id: number;
  name: string;
};

export const EventList = () => {
  // TODO: LocalStorageから取得
  const data = mockEventList;
  return (
    <>
      {data.map((event) => {
        return (
          <Box marginBottom={"10px"} key={event.id}>
            <EventCard {...event} />
          </Box>
        );
      })}
    </>
  );
};

const EventCard: FC<Event> = ({ id, name }) => {
  return (
    <Card>
      <CardContent>
        <Typography sx={{ fontSize: 14, textAlign: "center" }}>
          {name}
        </Typography>
      </CardContent>
    </Card>
  );
};
