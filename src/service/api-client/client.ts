import { AuthorizeClient } from "./protocol/AuthorizeServiceClientPb";
import { EventClient } from "./protocol/EventServiceClientPb";
// TODO: 環境変数
export const authClient = new AuthorizeClient(
  "http://localhost:9000",
  null,
  null
);
export const eventClient = new EventClient("http://localhost:9000", null, null);
