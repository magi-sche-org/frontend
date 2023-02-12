import { AuthorizeClient } from "./protocol/AuthorizeServiceClientPb";
import { EventClient } from "./protocol/EventServiceClientPb";
import {go_endpoint} from "@/libraries/env";
// TODO: 環境変数
export const authClient = new AuthorizeClient(
  go_endpoint,
  null,
  null
);
export const eventClient = new EventClient(go_endpoint, null, null);
