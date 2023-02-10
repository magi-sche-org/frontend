import { Box, Card } from "@mui/material";
import { mockEventList } from "./data";
import CardContent from "@mui/material/CardContent";
import Typography from "@mui/material/Typography";
import { FC } from "react";
import { EventClient } from "@/service/api-client/protocol/EventServiceClientPb";
import { GetEventRequest } from "@/service/api-client/protocol/event_pb";
export type Event = {
  id: number;
  name: string;
};

export const EventList = () => {
  // TODO: LocalStorageから取得
  const data = mockEventList;
  const client = new EventClient("http://localhost:9000", null, null);
  const req = new GetEventRequest();
  req.setId("hoge");
  req.setToken("fuga");
  const eventData = client.getEvent(req, null).then((res) => {
    console.log(res);
    return res.getId();
  });
  return (
    <>
      {data.map((event) => {
        return (
          <Box marginBottom={"10px"} key={event.id}>
            <EventCard {...event}></EventCard>
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
