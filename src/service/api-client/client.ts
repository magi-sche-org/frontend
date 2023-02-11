import { AuthorizeClient } from "./protocol/AuthorizeServiceClientPb";
// TODO: 環境変数
export const client = new AuthorizeClient("http://localhost:9000", null, null);
