import { GetEventResponse } from "@/service/api-client/protocol/event_pb";
import { rest } from "msw";

export const handlers = [
  // Handles a GET /user request
  rest.post("/GetEvent", (req, res, ctx) => {
    const response = new GetEventResponse();
    response.setId("111");
    response.setName("hoge");
    response.setOwner(true);
    response.setTimeunit();
    response.setAnswersList([]);
    return res(ctx.body(response.serializeBinary()));
  }),
];
